import type { Question } from '@shared/schema';

interface DomainAllocation {
  domain: string;
  count: number;
  weight: number;
}

export function allocateQuestions(
  blueprint: Record<string, number>,
  selectedDomains: string[],
  questionCount: number,
  availableQuestions: Map<string, Question[]>
): { allocations: DomainAllocation[]; selectedQuestions: Question[] } {
  const selectedBlueprint: Record<string, number> = {};
  let totalWeight = 0;
  
  for (const domain of selectedDomains) {
    if (blueprint[domain]) {
      selectedBlueprint[domain] = blueprint[domain];
      totalWeight += blueprint[domain];
    }
  }
  
  // Renormalize weights
  for (const domain in selectedBlueprint) {
    selectedBlueprint[domain] = selectedBlueprint[domain] / totalWeight;
  }
  
  // Allocate question counts
  const allocations: DomainAllocation[] = [];
  const fractionalParts: Array<{ domain: string; fraction: number }> = [];
  let allocatedCount = 0;
  
  for (const domain in selectedBlueprint) {
    const weight = selectedBlueprint[domain];
    const exactCount = weight * questionCount;
    const baseCount = Math.floor(exactCount);
    const fraction = exactCount - baseCount;
    
    allocations.push({ domain, count: baseCount, weight });
    fractionalParts.push({ domain, fraction });
    allocatedCount += baseCount;
  }
  
  // Distribute remainder based on largest fractional parts
  fractionalParts.sort((a, b) => b.fraction - a.fraction);
  const remainder = questionCount - allocatedCount;
  
  for (let i = 0; i < remainder && i < fractionalParts.length; i++) {
    const allocation = allocations.find(a => a.domain === fractionalParts[i].domain);
    if (allocation) allocation.count++;
  }
  
  // Select questions
  const selectedQuestions: Question[] = [];
  
  for (const allocation of allocations) {
    const questions = availableQuestions.get(allocation.domain) || [];
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    selectedQuestions.push(...shuffled.slice(0, allocation.count));
  }
  
  // Shuffle all selected questions
  return {
    allocations,
    selectedQuestions: selectedQuestions.sort(() => Math.random() - 0.5)
  };
}

export function gradeQuestion(
  question: Question,
  selected: string[]
): { score: number; feedback: any } {
  const options = question.options as any[];
  
  // Determine correct and incorrect selected answers based on weight
  const correct = selected.filter(id => {
    const opt = options.find(o => o.id === id);
    return opt && opt.weight > 0;
  });
  const incorrect = selected.filter(id => {
    const opt = options.find(o => o.id === id);
    return opt && opt.weight === 0;
  });
  
  if (question.type === 'MCQ') {
    const selectedOption = options.find(o => o.id === selected[0]);
    return {
      score: selectedOption ? selectedOption.weight : 0,
      feedback: {
        correct,
        incorrect,
        explanation: question.explanation
      }
    };
  } else {
    // MSQ scoring
    const positiveOptions = options.filter(o => o.weight > 0);
    const selectedWeights = selected.map(id => {
      const opt = options.find(o => o.id === id);
      return opt ? opt.weight : 0;
    });
    
    const avgWeight = selectedWeights.reduce((a: number, b: number) => a + b, 0) / selectedWeights.length;
    const selectedPositive = selected.filter(id => {
      const opt = options.find(o => o.id === id);
      return opt && opt.weight > 0;
    }).length;
    
    const coverage = selectedPositive / Math.min(positiveOptions.length, selected.length);
    const score = avgWeight * coverage;
    
    return {
      score: isNaN(score) ? 0 : score,
      feedback: {
        correct,
        incorrect,
        explanation: question.explanation
      }
    };
  }
}

export function calculateFinalScore(
  questions: Array<{ qid: string; domain: string }>,
  answers: Record<string, { perItemScore: number }>,
  blueprint: Record<string, number>
): {
  overallScorePct: number;
  perDomain: Array<{
    domain: string;
    weight: number;
    count: number;
    mean: number;
    contribution: number;
  }>;
} {
  const domainScores: Map<string, number[]> = new Map();
  
  // Group scores by domain
  for (const q of questions) {
    const answer = answers[q.qid];
    if (answer) {
      if (!domainScores.has(q.domain)) {
        domainScores.set(q.domain, []);
      }
      domainScores.get(q.domain)!.push(answer.perItemScore);
    }
  }
  
  // Calculate domain means and contributions
  const perDomain: Array<{
    domain: string;
    weight: number;
    count: number;
    mean: number;
    contribution: number;
  }> = [];
  
  let overallScore = 0;
  
  Array.from(domainScores.entries()).forEach(([domain, scores]) => {
    const mean = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
    const weight = blueprint[domain] || 0;
    const contribution = mean * weight;
    
    perDomain.push({
      domain,
      weight,
      count: scores.length,
      mean,
      contribution
    });
    
    overallScore += contribution;
  });
  
  return {
    overallScorePct: Math.round(overallScore * 100),
    perDomain
  };
}
