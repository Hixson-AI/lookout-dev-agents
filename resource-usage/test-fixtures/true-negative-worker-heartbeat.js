// EXPECT: no findings (heartbeat cleared in finally)
export async function runJob() {
  const heartbeat = setInterval(() => {
    /* beat */
  }, 30000);
  try {
    await doWork();
  } finally {
    clearInterval(heartbeat);
  }
}
async function doWork() {}
