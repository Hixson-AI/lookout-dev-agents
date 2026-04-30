// EXPECT: performance MEDIUM (truly nested)
export function pairs(xs, ys) {
  const out = [];
  for (const x of xs) {
    for (const y of ys) {
      out.push([x, y]);
    }
  }
  return out;
}
