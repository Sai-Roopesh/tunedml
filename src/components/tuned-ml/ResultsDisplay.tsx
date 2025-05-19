"use client";

import type * as React from 'react';
import { Award, ListChecks } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { TuningResult } from '@/types';

interface ResultsDisplayProps {
  results: Pick<TuningResult, 'bestParams' | 'bestScore'> | null;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  if (!results) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Optimal Configuration</CardTitle>
          <CardDescription>Best hyperparameters and score will appear here after tuning.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-48 text-muted-foreground">
          <ListChecks className="h-8 w-8 mr-2" />
          <span>Awaiting tuning results...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Optimal Configuration Found</CardTitle>
        <CardDescription>The best hyperparameters and cross-validation score from the tuning process.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold flex items-center text-primary">
            <Award className="mr-2 h-5 w-5" />
            Best Cross-Validation Score
          </h3>
          <p className="text-2xl font-bold text-accent-foreground">{results.bestScore.toFixed(4)}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold flex items-center text-primary">
            <ListChecks className="mr-2 h-5 w-5" />
            Best Hyperparameters
          </h3>
          {Object.keys(results.bestParams).length > 0 ? (
            <pre className="mt-1 p-3 bg-muted rounded-md text-sm overflow-x-auto">
              {JSON.stringify(results.bestParams, null, 2)}
            </pre>
          ) : (
            <p className="text-muted-foreground">No parameters to display.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
