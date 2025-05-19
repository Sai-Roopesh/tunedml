# **App Name**: TunedML

## Core Features:

- Configuration Form: Form to select dataset, model, and optimization trials.
- Training Trigger: HTTPS endpoint triggered by the frontend to start model training.
- Hyperparameter Tuning: Performs Bayesian optimization and stores results in Firestore.
- Performance Chart: Displays a chart of trial performance over time.
- Results Display: Shows the best hyperparameters found and the final cross-validation score.

## Style Guidelines:

- Primary color: Moderate blue (#5DADE2) for reliability and intelligence. Its slightly muted tone keeps it from being too playful, appropriate for technical content.
- Background color: Very light blue (#F0F8FF). It matches the primary color but is desaturated to create a light background.
- Accent color: Light green (#A2E38D).  It provides a soft but noticeable visual cue, especially for positive feedback or successful tuning results. Because green's hue is somewhat close to that of blue, it can still work in harmony with blue as an analogous color.
- Clean and readable sans-serif font for form labels, data display, and chart axes.
- Simple, outlined icons for key actions (e.g., 'Train,' 'Download').
- Clear separation of the configuration form, performance chart, and results display for a structured user experience.
- Subtle loading animations and transitions when starting/finishing model training.