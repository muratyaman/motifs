const SEP = '::'; // just separator for creating namespace for different collections of record in same cache/table

export const makeKeyMaker = (name: string) => {
  return (id: string) => `${name}${SEP}${id}`;
}

export const makeId = (key: string) => key.split(SEP)[1];
