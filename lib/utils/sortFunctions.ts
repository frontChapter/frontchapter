// sort by date
export const sortByDate = (array: any[]) => {
  const sortedArray = array.sort((a: any, b: any) => {
    const dateA = new Date(a.frontmatter?.date && a.frontmatter?.date).getTime();
    const dateB = new Date(b.frontmatter?.date && b.frontmatter?.date).getTime();
    return dateB - dateA;
  });
  return sortedArray;
};

// sort product by weight
export const sortByWeight = (array: any[]) => {
  const withWeight = array.filter((item) => item.frontmatter.weight);
  const withoutWeight = array.filter((item) => !item.frontmatter.weight);
  const sortedWeightedArray = withWeight.sort(
    (a, b) => a.frontmatter.weight - b.frontmatter.weight
  );
  const sortedArray = [...new Set([...sortedWeightedArray, ...withoutWeight])];
  return sortedArray;
};
