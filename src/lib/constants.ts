export type DatasetOption = 'iris' | 'diabetes' | 'wine';
export type ModelOption = 'RandomForestClassifier' | 'LogisticRegression' | 'RandomForestRegressor' | 'LinearRegression';

export const DATASET_OPTIONS: { value: DatasetOption; label: string; type: 'classification' | 'regression' }[] = [
  { value: 'iris', label: 'Iris Dataset (Classification)', type: 'classification' },
  { value: 'diabetes', label: 'Diabetes Dataset (Regression)', type: 'regression' },
  { value: 'wine', label: 'Wine Dataset (Classification)', type: 'classification' },
];

export const MODEL_OPTIONS: { value: ModelOption; label: string; type: 'classification' | 'regression' }[] = [
  { value: 'RandomForestClassifier', label: 'Random Forest Classifier', type: 'classification' },
  { value: 'LogisticRegression', label: 'Logistic Regression', type: 'classification' },
  { value: 'RandomForestRegressor', label: 'Random Forest Regressor', type: 'regression' },
  { value: 'LinearRegression', label: 'Linear Regression', type: 'regression' },
];

export const DEFAULT_NUM_TRIALS = 10;
