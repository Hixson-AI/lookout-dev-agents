// EXPECT: no findings (Promise-resolver pattern)
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
