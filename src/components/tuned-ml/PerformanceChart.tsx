"use client";

import type * as React from 'react';
import { BarChart, LineChart, TrendingUp } from 'lucide-react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  LineProps,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip as ShadcnChartTooltip,
  ChartTooltipContent,
  ChartLegend as ShadcnChartLegend,
  ChartLegendContent,
  ChartConfig,
} from '@/components/ui/chart';
import type { TrialData } from '@/types';

interface PerformanceChartProps {
  data: TrialData[];
  chartType?: 'line' | 'bar'; // Example for future extension
}

const chartConfig = {
  score: {
    label: 'CV Score',
    color: 'hsl(var(--chart-1))', // Uses primary color from theme
    icon: TrendingUp,
  },
} satisfies ChartConfig;


export function PerformanceChart({ data, chartType = 'line' }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Performance Over Trials</CardTitle>
          <CardDescription>No tuning data available yet. Run tuning to see performance.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64 text-muted-foreground">
          <LineChart className="h-8 w-8 mr-2" />
          <span>Awaiting tuning results...</span>
        </CardContent>
      </Card>
    );
  }
  
  // Ensure Y-axis domain covers the data range appropriately
  const scores = data.map(d => d.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);
  const yDomainPadding = (maxScore - minScore) * 0.1 || 0.05; // Add 10% padding or a minimum if range is 0

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Performance Over Trials</CardTitle>
        <CardDescription>Cross-validation score for each optimization trial.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="trial"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                label={{ value: 'Trial Number', position: 'insideBottom', offset: -15 }}
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                domain={[Math.max(0, minScore - yDomainPadding), Math.min(1, maxScore + yDomainPadding)]} 
                tickFormatter={(value) => value.toFixed(3)}
                label={{ value: 'CV Score', angle: -90, position: 'insideLeft', offset:10 }}
              />
              <ShadcnChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" labelKey="score" nameKey="trial" />}
              />
              <RechartsLegend content={<ChartLegendContent />} verticalAlign="top" align="right" wrapperStyle={{paddingBottom: '10px'}} />
              <Line
                dataKey="score"
                type="monotone"
                stroke={`hsl(var(--chart-1))`}
                strokeWidth={2}
                dot={{
                  fill: `hsl(var(--chart-1))`,
                  r: 4,
                }}
                activeDot={{
                  r:6,
                  style: { stroke: 'hsl(var(--background))', strokeWidth: 2 }
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
