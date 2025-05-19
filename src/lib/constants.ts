
export type DatasetOption = 'iris' | 'diabetes' | 'wine' | 'breast_cancer' | 'california_housing';
export type ModelOption = 
  | 'RandomForestClassifier' 
  | 'LogisticRegression' 
  | 'RandomForestRegressor' 
  | 'LinearRegression'
  | 'SVC'
  | 'SVR'
  | 'KNeighborsClassifier'
  | 'KNeighborsRegressor';

export const DATASET_OPTIONS: { value: DatasetOption; label: string; type: 'classification' | 'regression' }[] = [
  { value: 'iris', label: 'Iris Dataset (Classification)', type: 'classification' },
  { value: 'diabetes', label: 'Diabetes Dataset (Regression)', type: 'regression' },
  { value: 'wine', label: 'Wine Dataset (Classification)', type: 'classification' },
  { value: 'breast_cancer', label: 'Breast Cancer Dataset (Classification)', type: 'classification' },
  { value: 'california_housing', label: 'California Housing Dataset (Regression)', type: 'regression' },
];

export const MODEL_OPTIONS: { value: ModelOption; label: string; type: 'classification' | 'regression' }[] = [
  { value: 'RandomForestClassifier', label: 'Random Forest Classifier', type: 'classification' },
  { value: 'LogisticRegression', label: 'Logistic Regression', type: 'classification' },
  { value: 'SVC', label: 'Support Vector Classifier', type: 'classification' },
  { value: 'KNeighborsClassifier', label: 'K-Nearest Neighbors Classifier', type: 'classification' },
  { value: 'RandomForestRegressor', label: 'Random Forest Regressor', type: 'regression' },
  { value: 'LinearRegression', label: 'Linear Regression', type: 'regression' },
  { value: 'SVR', label: 'Support Vector Regressor', type: 'regression' },
  { value: 'KNeighborsRegressor', label: 'K-Nearest Neighbors Regressor', type: 'regression' },
];

export const DEFAULT_NUM_TRIALS = 10;
