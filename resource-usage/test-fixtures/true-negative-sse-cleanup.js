// EXPECT: no findings (per-request listeners with done() cleanup)
export function sseHandler(req, res) {
  const heartbeat = setInterval(() => res.write(': ping\n\n'), 25000);
  const done = () => {
    clearInterval(heartbeat);
  };
  req.on('close', done);
  req.on('end', done);
  res.on('close', done);
}
