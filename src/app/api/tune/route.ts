import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { TuningFormValues, TuningResult, TrialData } from '@/types';
// Attempt to import Genkit runFlow. Actual flow invocation will depend on how flows are defined and registered.
// import { runFlow } from '@genkit-ai/next/server';
// import { tunedMlMainFlow } from '@/ai/flows/tunedMlMainFlow'; // Assuming a flow like this exists

// --- Mock Data Generation ---
// This section will be used if the Genkit flow call is not implemented or fails.
const generateMockData = (numTrials: number, dataset: string, modelType: string): TuningResult => {
  console.log(`Generating mock data for ${numTrials} trials, dataset: ${dataset}, model: ${modelType}`);
  const trialsData: TrialData[] = [];
  let bestScore = 0;
  let bestParams: Record<string, any> = {};

  for (let i = 0; i < numTrials; i++) {
    // Simulate score improvement or fluctuation
    const rawScore = 0.65 + Math.random() * 0.30 * (1 + i / (numTrials * 2)); // Slight upward trend
    const score = parseFloat(rawScore.toFixed(4));
    const params: Record<string, any> = {
      learning_rate: parseFloat((Math.random() * 0.1 + 0.001).toFixed(4)),
      n_estimators: Math.floor(Math.random() * 150) + 50,
      max_depth: Math.floor(Math.random() * 10) + 3,
    };

    if (modelType.includes('Classifier')) {
      params.criterion = Math.random() > 0.5 ? 'gini' : 'entropy';
    }
    
    trialsData.push({ trial: i + 1, score });

    if (score > bestScore) {
      bestScore = score;
      bestParams = params;
    }
  }
  if (Object.keys(bestParams).length === 0 && trialsData.length > 0) { // if somehow bestParams wasn't set
    bestParams = { simulated_param: "default_value" }; // fallback
  }


  return { trialsData, bestParams, bestScore };
};
// --- End Mock Data Generation ---


export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as TuningFormValues;
    const { dataset, modelType, numTrials } = body;

    if (!dataset || !modelType || !numTrials) {
      return NextResponse.json({ message: 'Missing required parameters: dataset, modelType, numTrials' }, { status: 400 });
    }
    if (numTrials <= 0 || numTrials > 100) { // Max 100 trials for free tier simulation
        return NextResponse.json({ message: 'Number of trials must be between 1 and 100.' }, { status: 400 });
    }
    
    // Placeholder for Genkit flow invocation
    // IMPORTANT: The existence and signature of `tunedMlMainFlow` are assumed.
    // If Genkit and the specific flow are not set up, this will need to be adapted or will fail.
    // For now, we'll use mock data generation.
    
    let result: TuningResult;

    try {
      // Example of how a Genkit flow *might* be called:
      // result = await runFlow(tunedMlMainFlow, { dataset, modelType, numTrials });
      
      // If runFlow or tunedMlMainFlow is not available or correctly configured,
      // the following lines will act as a fallback to generate mock data.
      // This ensures the frontend can be tested.
      // In a real scenario with Genkit, this mock generation would be removed.
      console.warn("Genkit flow 'tunedMlMainFlow' not invoked. Using mock data generation.");
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500)); // Simulate processing time
      result = generateMockData(numTrials, dataset, modelType);

    } catch (flowError) {
      console.error("Error invoking Genkit flow:", flowError);
      console.warn("Fallback: Genkit flow invocation failed. Using mock data generation.");
      // Fallback to mock data if flow fails
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      result = generateMockData(numTrials, dataset, modelType);
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    let message = 'An unexpected error occurred.';
    if (error instanceof Error) {
        message = error.message;
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}
