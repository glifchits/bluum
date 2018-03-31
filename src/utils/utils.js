// Collection of helper functions

export const sortCoffee = (sortBy, coffeeList) => {
  sortedCoffee = coffeeList.sort((a, b) => {
    if (typeof a[sortBy] === "string") {
      return a[sortBy].localeCompare(b[sortBy]);
    } else {
      return b[sortBy] - a[sortBy];
    }
  });
  return sortedCoffee;
};
