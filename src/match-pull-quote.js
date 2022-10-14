module.exports = (s) => {
  const matches = s.match(/(?<!\w)'[\w\s,']+?'(?!\w)/g);
  if (matches) {
    return matches.map(m => m.slice(1, -1));
  }
  return null;
}
