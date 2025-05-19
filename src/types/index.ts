import type { DatasetOption, ModelOption } from '@/lib/constants';

export interface TuningFormValues {
  dataset: DatasetOption;
  modelType: ModelOption;
  numTrials: number;
}

export interface TrialData {
  trial: number;
  score: number;
}

export interface TuningResult {
  trialsData: TrialData[];
  bestParams: Record<string, any>;
  bestScore: number;
}

export interface ApiError {
  message: string;
}
