"use client";

import { useState } from 'react';
import type { TuningResult, TrialData } from '@/types';
import { ConfigurationForm } from '@/components/tuned-ml/ConfigurationForm';
import { PerformanceChart } from '@/components/tuned-ml/PerformanceChart';
import { ResultsDisplay } from '@/components/tuned-ml/ResultsDisplay';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from 'lucide-react';

export default function TunedMLPage() {
  const [tuningResults, setTuningResults] = useState<Pick<TuningResult, 'bestParams' | 'bestScore'> | null>(null);
  const [chartData, setChartData] = useState<TrialData[]>([]);
  const [error, setError] = useState<string | null>(null);
  // isLoading state is managed within ConfigurationForm, but could be lifted if needed for global spinners

  const handleTuningStart = () => {
    setError(null);
    setTuningResults(null);
    setChartData([]);
  };

  const handleTuningComplete = (results: TuningResult) => {
    setTuningResults({ bestParams: results.bestParams, bestScore: results.bestScore });
    setChartData(results.trialsData);
    setError(null);
  };

  const handleTuningError = (errorMessage: string) => {
    setError(errorMessage);
    setTuningResults(null);
    setChartData([]);
  };

  return (
    <div className="space-y-8">
      <ConfigurationForm 
        onTuningStart={handleTuningStart}
        onTuningComplete={handleTuningComplete}
        onTuningError={handleTuningError}
        bestParams={tuningResults?.bestParams || null}
      />

      {error && (
        <Alert variant="destructive" className="shadow-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <PerformanceChart data={chartData} />
        <ResultsDisplay results={tuningResults} />
      </div>
    </div>
  );
}
