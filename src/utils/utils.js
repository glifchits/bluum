// Collection of helper functions

import { AsyncStorage } from "react-native";
import { TOKEN_KEY } from "../constants";

export async function isLoggedIn() {
  // TODO expire the token at some point, do a server side re-check
  let token = await AsyncStorage.getItem(TOKEN_KEY);
  return token !== null;
}

export const _norm = str => {
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

export const capitalize = str => {
  return str[0].toUpperCase() + str.slice(1);
};

export const snakeCaseToPresentable = str => {
  const [first, ...rest] = str.split("_");
  return [capitalize(first), ...rest].join(" ");
};
