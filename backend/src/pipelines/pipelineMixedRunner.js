// 1. A “Mixed” Pipeline with Parallel Steps
// Let’s define a function runPipelineMixed(steps, initialContext) where:

// Each element in steps can be either:
// A single async function for a sequential step, or
// An array of async functions to be run in parallel.
// We’ll keep the EventEmitter approach for SSE or logging. Note: This is just an example – feel free to refine it.

// pipeline/mixedPipeline.js
import { EventEmitter } from 'node:events';

/**
 * A pipeline that supports both sequential steps and parallel steps.
 * - If steps[i] is a function: run it sequentially.
 * - If steps[i] is an array of functions: run them in parallel.
 *
 * Each function is: async (context) => Promise<result>
 */
export function runPipelineMixed(steps = [], initialContext = {}) {
  const emitter = new EventEmitter();

  const pipelinePromise = (async () => {
    let context = { ...initialContext };
    const results = [];

    try {
      for (const stepOrSteps of steps) {
        // Distinguish between single step vs. parallel steps
        if (typeof stepOrSteps === 'function') {
          // ===== SEQUENTIAL STEP =====
          const stepName = stepOrSteps.name || 'anonymousStep';
          const stepResult = await stepOrSteps(context);

          results.push({ step: stepName, data: stepResult });

          // Merge result into context
          if (stepResult && typeof stepResult === 'object') {
            context = { ...context, ...stepResult };
          }

          // Emit an event for this step
          emitter.emit('step', {
            step: stepName,
            result: stepResult,
            updatedContext: context,
            parallel: false
          });

        } else if (Array.isArray(stepOrSteps)) {
          // ===== PARALLEL STEPS =====
          // e.g. [fn1, fn2, fn3]
          // We'll run them with Promise.all
          const parallelFns = stepOrSteps;
          const parallelStepNames = parallelFns.map(fn => fn.name || 'anonymousStep');

          // Start them all in parallel
          const parallelResults = await Promise.all(
            parallelFns.map(fn => fn(context))
          );

          // Each result merges into context
          // A simple approach: just merge them in order
          // or you could combine them in a single object if needed
          parallelResults.forEach((pr, index) => {
            const name = parallelStepNames[index];
            results.push({ step: name, data: pr });

            if (pr && typeof pr === 'object') {
              context = { ...context, ...pr };
            }
          });

          // We can emit a single "step" event for the entire parallel batch
          // or multiple events. Let’s do a single event with an array of sub-results.
          emitter.emit('step', {
            parallel: true,
            steps: parallelStepNames,
            results: parallelResults,
            updatedContext: context
          });
        } else {
          throw new Error(`Invalid step type: must be a function or array of functions`);
        }
      }

      // Done
      emitter.emit('done', {
        results,
        finalContext: context
      });

      return results;
    } catch (err) {
      emitter.emit('error', err);
      throw err;
    }
  })();

  return { emitter, promise: pipelinePromise };
}
