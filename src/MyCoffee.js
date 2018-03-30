import React, { Fragment } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Picker,
  TextInput,
} from "react-native";
import { Header, List, ListItem, Icon } from "react-native-elements";
import Rating from "./Rating.js";

import my_coffees from "./my_coffees";

const SORT_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Roaster", value: "roaster" },
  { label: "Roast Type", value: "type" },
  { label: "Region", value: "region" },
  { label: "Filter/Espresso", value: "filter" },
  { label: "Rating", value: "rating" },
  { label: "Date Added", value: "dateAdded" },
];

const _norm = str => {
  return str.toLowerCase().replace(/ /g, "");
};

export default class MyCoffeeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      coffeeList: my_coffees,
      sortBy: "name",
      sortDirection: "desc",
      searching: false,
      searchTerm: "",
    };

    this.sortCoffee = this.sortCoffee.bind(this);
    this.filterCoffee = this.filterCoffee.bind(this);
    this.handleSearchToggle = this.handleSearchToggle.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  static navigationOptions = {
    header: null,
  };

  filterCoffee(coffee) {
    const { searchTerm } = this.state;
    const matchStr = Object.values(coffee)
      .map(val => _norm(val.toString()))
      .join("");
    const search = _norm(searchTerm);
    return matchStr.indexOf(search) >= 0;
  }

  sortCoffee() {
    const { sortBy, coffeeList } = this.state;
    sortedCoffee = coffeeList.sort((a, b) => {
      if (typeof a[sortBy] === "string") {
        return a[sortBy].localeCompare(b[sortBy]);
      } else {
        return b[sortBy] - a[sortBy];
      }
    });
    return sortedCoffee;
  }

  renderSortOptions() {
    return SORT_OPTIONS.map(opt => {
      return (
        <Picker.Item label={opt.label} value={opt.value} key={opt.label} />
      );
    });
  }

  handleSearchToggle() {
    const searching = !this.state.searching;
    this.setState({ searching: searching, searchTerm: "" });
  }

  handleSearchChange(inputValue) {
    this.setState({ searchTerm: inputValue });
  }

  handleSelectCoffee(coffee) {
    this.props.navigation.navigate("CoffeeProfile", {
      coffee: coffee,
    });
  }

  render() {
    const sortedCoffee = this.sortCoffee().filter(this.filterCoffee);

    const results = sortedCoffee.map((coffee, index) => (
      <ListItem
        key={index}
        title={coffee.name}
        onPress={() => this.handleSelectCoffee(coffee)}
        subtitle={
          <View>
            <Text>{coffee.roaster}</Text>
            <Rating rating={coffee.rating} ratingCount={5} />
          </View>
        }
      />
    ));

    const centerComponent = this.state.searching ? (
      <TextInput
        key="searchTextInput"
        placeholder="Search coffee"
        onChangeText={this.handleSearchChange}
        autoFocus
        style={styles.searchBox}
        placeholderTextColor="#fff"
        value={this.state.searchTerm}
      />
    ) : (
      <Text style={{ color: "#fff" }}>My Coffee</Text>
    );

    return (
      <View style={styles.container}>
        <Header
          centerComponent={centerComponent}
          rightComponent={
            <Icon
              name={this.state.searching ? "close" : "search"}
              color="#fff"
              onPress={this.handleSearchToggle}
            />
          }
          outerContainerStyles={{ backgroundColor: "#8b8c8c" }}
          innerContainerStyles={{ justifyContent: "space-between" }}
        />
        <View>
          <Text>Sort by:</Text>
          <Picker
            selectedValue={this.state.sortBy}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({ sortBy: itemValue });
            }}
          >
            {this.renderSortOptions()}
          </Picker>
        </View>
        <List>{results}</List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  searchBox: {
    flex: 1,
    minWidth: 200,
    color: "#fff",
    fontSize: 16,
  },
});
