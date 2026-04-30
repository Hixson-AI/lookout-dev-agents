// EXPECT: memory-leak MEDIUM (setInterval handle not stored)
export function startBeacon() {
  setInterval(() => {
    console.log('beacon');
  }, 1000);
}
