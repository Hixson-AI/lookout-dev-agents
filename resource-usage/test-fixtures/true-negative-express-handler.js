// EXPECT: no findings — Express route handler with next(err) is fine
export async function listThings(req, res, next) {
  try {
    const rows = await fetchRows();
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
}
async function fetchRows() {
  return [];
}
