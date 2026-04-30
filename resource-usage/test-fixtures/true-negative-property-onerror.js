// EXPECT: no findings (.onError is property access, not .on('error'))
export function evaluate(step) {
  if (step.onError?.type === 'continue') {
    return 'continue';
  }
  return 'stop';
}
