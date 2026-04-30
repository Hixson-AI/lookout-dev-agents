// EXPECT: no findings (loops are siblings, not nested)
export function build(xs) {
  const ids = new Map();
  for (const x of xs) ids.set(x.id, x);
  const inDegree = new Map();
  for (const x of xs) inDegree.set(x.id, 0);
  return { ids, inDegree };
}
