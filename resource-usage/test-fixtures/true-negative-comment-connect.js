// EXPECT: no findings — the word "connect" appears only in comments/strings
//   - event: snapshot on connect (full current step list)
export function noop() {
  const message = 'on connect we send the snapshot';
  return message;
}
