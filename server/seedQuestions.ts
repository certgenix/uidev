import { readFileSync } from 'fs';
import { storage } from './storage';
import type { InsertQuestion } from '@shared/schema';

interface CSVQuestion {
  id: string;
  domain: string;
  type: string;
  difficulty: string;
  stem: string;
  optionA: string;
  weightA: string;
  optionB: string;
  weightB: string;
  optionC: string;
  weightC: string;
  optionD: string;
  weightD: string;
  optionE?: string;
  weightE?: string;
  explanation_overview: string;
  explanation_optionNotes: string;
  timeSuggestedSec: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = i + 1 < line.length ? line[i + 1] : null;
    
    if (char === '"' && nextChar === '"' && inQuotes) {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result.map(s => s.trim());
}

function parseCSV(csvContent: string): CSVQuestion[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const headers = parseCSVLine(lines[0]);
  
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj: any = {};
    headers.forEach((header, i) => {
      obj[header] = values[i] || '';
    });
    return obj as CSVQuestion;
  });
}

export async function seedQuestions() {
  try {
    await storage.clearQuestions();
    console.log('Cleared old questions from database');
    
    const csvContent = readFileSync('attached_assets/CISSP_sample_questions_1760135926255.csv', 'utf-8');
    const csvQuestions = parseCSV(csvContent);
    
    const questions: InsertQuestion[] = csvQuestions.map(q => {
      const options: any[] = [
        { id: 'A', text: q.optionA, weight: parseFloat(q.weightA) },
        { id: 'B', text: q.optionB, weight: parseFloat(q.weightB) },
        { id: 'C', text: q.optionC, weight: parseFloat(q.weightC) },
        { id: 'D', text: q.optionD, weight: parseFloat(q.weightD) },
      ];
      
      if (q.optionE) {
        options.push({ id: 'E', text: q.optionE, weight: parseFloat(q.weightE || '0') });
      }
      
      let optionNotes = {};
      try {
        const notesStr = q.explanation_optionNotes.trim();
        optionNotes = JSON.parse(notesStr);
      } catch (e) {
        console.warn(`Failed to parse option notes for ${q.id}:`, e);
      }
      
      return {
        id: q.id,
        type: q.type,
        stem: q.stem,
        options,
        explanation: {
          overview: q.explanation_overview,
          optionNotes
        },
        domain: q.domain,
        difficulty: parseInt(q.difficulty),
        timeSuggestedSec: parseInt(q.timeSuggestedSec),
        status: 'published'
      };
    });
    
    await storage.createQuestions(questions);
    console.log(`Successfully seeded ${questions.length} questions`);
    return questions;
  } catch (error) {
    console.error('Error seeding questions:', error);
    throw error;
  }
}
