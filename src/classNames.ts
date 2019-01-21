const getClassNameArray = (possible: any): string[] => {
  let possibleClassNames: string[] = [];
  if (Array.isArray(possible)) {
    possible.forEach((entry) => {
      possibleClassNames = possibleClassNames.concat(getClassNameArray(entry));
    });
  } else if (possible && typeof possible === 'object') {
    for (const key in possible) {
      if (possible[key]) { possibleClassNames.push(key); }
    }
  } else if (typeof possible === 'string' || typeof possible === 'number') {
    possibleClassNames.push(possible.toString());
  }

  return possibleClassNames;
};

const classNames = (possible: any): string => {
  if (possible === null || possible === undefined) { return null; }
  return getClassNameArray(possible).join(' ');
};

export default classNames;
