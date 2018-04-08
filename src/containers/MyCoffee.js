import React, { Fragment } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Picker,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { Header, List, ListItem, Icon } from "react-native-elements";
import Rating from "../components/Rating";
import Dropdown from "../components/Dropdown";
import { sortCoffee, filterCoffee } from "../utils/utils";
import my_coffees from "../testdata/my_coffees";
import {
  LIGHT_BROWN,
  FONT_BOLD,
  FONT_REG,
  BORDER_RADIUS,
  OFF_BLACK,
} from "../styles/common";
import CoffeeCard from "../components/CoffeeCard";

const SORT_OPTIONS = [
  { label: "Name", value: "name" },
  { label: "Roaster", value: "roaster" },
  { label: "Roast Type", value: "type" },
  { label: "Region", value: "region" },
  { label: "Filter/Espresso", value: "filter" },
  { label: "Rating", value: "rating" },
  { label: "Date Added", value: "dateAdded" },
];

const STATUS_BAR_OFFSET = 35;

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

    this.handleSearchToggle = this.handleSearchToggle.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleSelectCoffee = this.handleSelectCoffee.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  static navigationOptions = {
    header: null,
  };

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

  clearSearch() {
    this.setState({ searchTerm: "" });
  }

  render() {
    const { sortBy, coffeeList, searchTerm, searching } = this.state;
    const sortedCoffee = sortCoffee(sortBy, coffeeList).filter(coffee =>
      filterCoffee(coffee, searchTerm),
    );

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
        {!searching ? (
          <View style={styles.headerContainer}>
            <View style={styles.headerLeft} />
            <View style={styles.headerCenter}>
              <Text style={styles.headerName}>My Coffee</Text>
            </View>
            <View style={styles.headerRight}>
              <Icon
                name="search"
                color="#fff"
                onPress={this.handleSearchToggle}
              />
            </View>
          </View>
        ) : (
          <View style={styles.headerContainer}>
            <View style={styles.searchBox}>
              <Icon
                style={styles.icon}
                type="material"
                name="chevron-left"
                color={LIGHT_BROWN}
                onPress={this.handleSearchToggle}
              />
              <TextInput
                autoFocus
                key="searchTextInput"
                autoCorrect={false}
                spellCheck={false}
                value={searchTerm}
                placeholder="Search coffee"
                onChangeText={this.handleSearchChange}
                style={styles.searchInput}
                underlineColorAndroid="transparent"
              />
              <Icon
                style={styles.icon}
                type="material"
                name="close"
                color={LIGHT_BROWN}
                onPress={this.clearSearch}
              />
            </View>
          </View>
        )}
        <Dropdown
          label="Sort by:"
          selectedValue={this.state.sortBy}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({ sortBy: itemValue });
          }}
          options={SORT_OPTIONS}
        />
        <ScrollView style={styles.resultsContainer}>
          <Query
            query={gql`
              {
                coffee(limit: 10) {
                  id
                }
              }
            `}
          >
            {({ loading, error, data }) => {
              if (loading) return <Text>Loading...</Text>;
              if (error) return <Text>Error :(</Text>;
              return (
                <FlatList
                  data={data.coffee}
                  renderItem={({ item }) => (
                    <CoffeeCard
                      coffeeID={item.id}
                      onPress={() => this.handleSelectCoffee(item.id)}
                    />
                  )}
                  keyExtractor={item => item.id}
                />
              );
            }}
          </Query>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  searchBox: {
    backgroundColor: "#fff",
    borderRadius: BORDER_RADIUS,
    flexDirection: "row",
    padding: 5,
  },
  searchInput: {
    marginLeft: 10,
    color: OFF_BLACK,
    flexGrow: 1,
    fontSize: 18,
  },
  icon: {
    flexGrow: 0,
  },
  headerContainer: {
    backgroundColor: LIGHT_BROWN,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? STATUS_BAR_OFFSET : 12,
    paddingBottom: 12,
    paddingLeft: 10,
    paddingRight: 10,
  },
  headerLeft: {
    flexGrow: 0,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRight: {
    flexGrow: 0,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  headerName: {
    fontSize: 18,
    fontFamily: FONT_REG,
    color: "#fff",
  },
  resultsContainer: {
    padding: 10,
  },
});
