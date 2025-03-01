// pipeline/musicPipeline.js
import { EventEmitter } from 'node:events';

/**
 * Run a pipeline of async steps in order.
 *
 * @param {Array<Function>} steps - array of async functions: (context) => result
 * @param {Object} [initialContext={}] - initial context object
 * @returns {{ emitter: EventEmitter, promise: Promise<Array> }} 
 *   emitter: emits "step", "done", "error"
 *   promise: resolves to array of step results, or rejects on error
 */
export function runPipeline(steps = [], initialContext = {}) {
  const emitter = new EventEmitter();

  const pipelinePromise = (async () => {
    let context = { ...initialContext };
    const results = [];

    try {
      for (const step of steps) {
        const stepName = step.name || 'anonymousStep';
        const stepResult = await step(context);

        results.push({ step: stepName, data: stepResult });

        if (stepResult && typeof stepResult === 'object') {
          context = { ...context, ...stepResult };
        }

        emitter.emit('step', {
          step: stepName,
          result: stepResult,
          updatedContext: context,
        });
      }

      emitter.emit('done', {
        results,
        finalContext: context,
      });
      return results;
    } catch (err) {
      emitter.emit('error', err);
      throw err;
    }
  })();

  return { emitter, promise: pipelinePromise };
}
