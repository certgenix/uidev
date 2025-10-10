import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ExamResults() {
  const { sessionId } = useParams();

  const { data: results, isLoading } = useQuery({
    queryKey: ["/api/sessions", sessionId, "results"],
    queryFn: async () => {
      const response = await fetch(`/api/sessions/${sessionId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      return await response.json();
    },
    enabled: !!sessionId
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading results...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span data-testid="text-certification-name">{results?.certificationName || "Exam"} Results</span>
              <Badge variant={results?.overallScorePct >= 70 ? "default" : "destructive"} className="text-2xl py-2 px-4" data-testid="badge-overall-score">
                {results?.overallScorePct}%
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-4">Domain Breakdown</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead data-testid="header-domain">Domain</TableHead>
                  <TableHead data-testid="header-weight">Weight</TableHead>
                  <TableHead data-testid="header-questions">Questions</TableHead>
                  <TableHead data-testid="header-score">Score</TableHead>
                  <TableHead data-testid="header-contribution">Contribution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results?.perDomain?.map((domain: any) => (
                  <TableRow key={domain.domain}>
                    <TableCell className="font-medium" data-testid={`cell-domain-${domain.domain}`}>{domain.domain}</TableCell>
                    <TableCell data-testid={`cell-weight-${domain.domain}`}>{(domain.weight * 100).toFixed(0)}%</TableCell>
                    <TableCell data-testid={`cell-count-${domain.domain}`}>{domain.count}</TableCell>
                    <TableCell data-testid={`cell-mean-${domain.domain}`}>{(domain.mean * 100).toFixed(0)}%</TableCell>
                    <TableCell data-testid={`cell-contribution-${domain.domain}`}>{(domain.contribution * 100).toFixed(0)}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Question Review</h3>
          {results?.items?.map((item: any, index: number) => (
            <Card key={item.qid}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base" data-testid={`text-question-${index}`}>
                    Question {index + 1}
                  </CardTitle>
                  <Badge variant={item.perItemScore >= 0.7 ? "default" : "destructive"} data-testid={`badge-score-${index}`}>
                    {(item.perItemScore * 100).toFixed(0)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Your Selection:</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.yourSelection?.map((sel: string) => (
                      <Badge key={sel} variant="outline" data-testid={`badge-selection-${index}-${sel}`}>
                        {sel}: {(item.weights[sel] * 100).toFixed(0)}%
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Explanation:</h4>
                  <p className="text-sm text-muted-foreground" data-testid={`text-explanation-${index}`}>
                    {item.explanation?.overview}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Answer Weights:</h4>
                  <div className="space-y-1">
                    {Object.entries(item.weights).map(([key, weight]: [string, any]) => (
                      <div key={key} className="flex items-center gap-2">
                        {weight >= 0.7 ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="text-sm" data-testid={`text-weight-${index}-${key}`}>
                          {key}: {(weight * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
