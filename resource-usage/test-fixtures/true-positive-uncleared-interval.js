// EXPECT: memory-leak MEDIUM (setInterval handle never cleared)
export function startBeacon() {
  const handle = setInterval(() => {
    console.log('beacon');
  }, 1000);
  return handle; // caller never clears it; no clearInterval anywhere in file
}
