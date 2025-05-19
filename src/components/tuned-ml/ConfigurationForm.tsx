"use client";

import type * as React from 'react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Play, Loader2, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DATASET_OPTIONS, MODEL_OPTIONS, DEFAULT_NUM_TRIALS, type DatasetOption, type ModelOption } from '@/lib/constants';
import type { TuningFormValues, TuningResult, ApiError } from '@/types';

const formSchema = z.object({
  dataset: z.custom<DatasetOption>((val) => DATASET_OPTIONS.map(opt => opt.value).includes(val as DatasetOption), {
    message: "Invalid dataset selection",
  }),
  modelType: z.custom<ModelOption>((val) => MODEL_OPTIONS.map(opt => opt.value).includes(val as ModelOption), {
    message: "Invalid model type selection",
  }),
  numTrials: z.coerce.number().int().min(1, "Number of trials must be at least 1").max(100, "Number of trials cannot exceed 100"),
});

interface ConfigurationFormProps {
  onTuningStart: () => void;
  onTuningComplete: (results: TuningResult) => void;
  onTuningError: (error: string) => void;
  bestParams: Record<string, any> | null;
}

export function ConfigurationForm({ onTuningStart, onTuningComplete, onTuningError, bestParams }: ConfigurationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [availableModels, setAvailableModels] = useState(MODEL_OPTIONS);

  const form = useForm<TuningFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dataset: DATASET_OPTIONS[0].value,
      modelType: MODEL_OPTIONS.filter(m => m.type === DATASET_OPTIONS[0].type)[0]?.value || MODEL_OPTIONS[0].value,
      numTrials: DEFAULT_NUM_TRIALS,
    },
  });

  const selectedDatasetValue = form.watch('dataset');

  useEffect(() => {
    const currentDataset = DATASET_OPTIONS.find(d => d.value === selectedDatasetValue);
    if (currentDataset) {
      const filteredModels = MODEL_OPTIONS.filter(m => m.type === currentDataset.type);
      setAvailableModels(filteredModels);
      // If current modelType is not compatible, reset it
      if (!filteredModels.some(m => m.value === form.getValues('modelType'))) {
        form.setValue('modelType', filteredModels[0]?.value || MODEL_OPTIONS[0].value);
      }
    }
  }, [selectedDatasetValue, form]);

  async function onSubmit(values: TuningFormValues) {
    setIsLoading(true);
    onTuningStart();

    try {
      const response = await fetch('/api/tune', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json();
        throw new Error(errorData.message || 'Failed to start tuning process');
      }

      const results: TuningResult = await response.json();
      onTuningComplete(results);
      toast({
        title: "Tuning Complete!",
        description: "Hyperparameter tuning finished successfully.",
        variant: "default", // Use default, which will pick up accent color styling if defined or primary
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      onTuningError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleDownloadParams = () => {
    if (!bestParams) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(bestParams, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "best_hyperparameters.json";
    link.click();
    toast({
      title: "Parameters Downloaded",
      description: "Best hyperparameters saved to best_hyperparameters.json.",
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Tune Model Hyperparameters</CardTitle>
        <CardDescription>Select a dataset, model, and number of optimization trials.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="dataset"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dataset</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a dataset" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DATASET_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableModels.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numTrials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Optimization Trials</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Tuning...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Start Tuning
                </>
              )}
            </Button>
            {bestParams && (
               <Button variant="outline" onClick={handleDownloadParams} type="button">
                <Download className="mr-2 h-4 w-4" />
                Download Params
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
