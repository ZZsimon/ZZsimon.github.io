export function getElementSize2(isPC, size) {
  if (size === 1) {
    return '1px';
  }
  if (isPC) {
    return parseInt(size / 2) + 'px';
  }
  const num = (+size * 100) / 750;
  const _size = num.toFixed(2) + 'vw';
  return _size;
}
