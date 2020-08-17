export default function ({
  newPosition,
  items,
  isFirstChild,
  insert = false,
  prepend = false
}) {
  const next = items[newPosition + 1];
  const current = items[newPosition];
  const count = items.length;
  let position, first, prev;

  if (insert) {
    first = items[0];
    prev = items[newPosition];
  } else if (prepend) {
    first = items[0];
    prev = items[newPosition - 1];
  } else {
    first = items[1];
    prev = items[newPosition - 1];
  }

  if (isFirstChild) {
    position = first ? first.position * 0.5 : 1;
  } else if (prepend) {
    position = ((prev ? prev.position : 0) + current.position) * 0.5;
  } else if (newPosition + 1 === count) {
    position = prev.position + 1;
  } else {
    position = (prev.position + next.position) * 0.5;
  }

  return position;
}
