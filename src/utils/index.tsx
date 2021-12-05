export function splitEvery<T>(n: number, list: T[]): Array<T[]> {
  if (n <= 0) {
    throw new Error('First argument to splitEvery must be a positive integer')
  }
  const result: Array<T[]> = []
  let idx = 0
  while (idx < list.length) {
    result.push(list.slice(idx, idx += n))
  }
  return result
}

export function shuffle<T>(list: T[]): T[] {
  return list
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}
