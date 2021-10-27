export function getElementSize(isPC, size) {
  if (isPC) {
    return size + 'px';
  }
  const num = (+size * 2 * 100) / 750;
  const _size = num.toFixed(2) + 'vw';
  return _size;
}
