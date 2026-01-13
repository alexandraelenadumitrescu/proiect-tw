// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function pickNRandomElementsFromArray(arr, count) {
  const copy = [...arr];
  const result = [];

  for (let i = 0; i < count && copy.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * copy.length);
    result.push(copy[randomIndex]);
    copy.splice(randomIndex, 1); // Elimină pentru a evita duplicate
  }

  return result;
}

exports.pickNRandomElementsFromArray = pickNRandomElementsFromArray;
