/**
 * Immutable shuffle
 */
export function shuffle<T>(array: readonly T[]): T[] {
  return shuffleInPlace(array.slice());
}

/**
 * Re-order an array to a random order in place
 *
 * @see https://stackoverflow.com/a/2450976/6840562
 */
function shuffleInPlace<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
