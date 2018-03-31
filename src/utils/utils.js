// Collection of helper functions

const _norm = str => {
  return str.toLowerCase().replace(/ /g, "");
};

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

export const filterCoffee = (coffee, searchTerm) => {
  const matchStr = Object.values(coffee)
    .map(val => _norm(val.toString()))
    .join("");
  const search = _norm(searchTerm);
  return matchStr.indexOf(search) >= 0;
};
