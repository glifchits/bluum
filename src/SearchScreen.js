import React, { Fragment } from "react";
import { StyleSheet, Text, FlatList, View, TextInput } from "react-native";
import coffees from "./coffees";

export default class HomeScreen extends React.Component {
  state = { inputValue: "" };

  _handleSearchChange = inputValue => this.setState({ inputValue });

  render() {
    const { inputValue } = this.state;
    let body;
    if (inputValue.length === 0) {
      body = (
        <Fragment>
          <Text style={{ fontWeight: "bold", fontSize: 26 }}>COOL BEANZ</Text>
          <TextInput
            key="searchTextInput"
            placeholder="Search coffee"
            onChangeText={this._handleSearchChange}
            style={styles.searchInput}
          />
          <Text>Recently brewed coffee</Text>
        </Fragment>
      );
    } else {
      body = (
        <Fragment>
          <TextInput
            key="searchTextInput"
            autoCorrect={false}
            spellCheck={false}
            value={inputValue}
            placeholder="Search coffee"
            onChangeText={this._handleSearchChange}
            style={styles.searchInputActive}
          />
          <SearchListing searchInput={inputValue} />
        </Fragment>
      );
    }

    return <View style={styles.container}>{body}</View>;
  }
}

const Coffee = ({ name, region, roaster }) => (
  <View style={{ borderWidth: 1, borderColor: "#ddd", padding: 10 }}>
    <Text style={{ fontWeight: "bold" }}>{name}</Text>
    <Text>{region}</Text>
    <Text>{roaster}</Text>
  </View>
);

class SearchListing extends React.Component {
  filterCoffee = coffee => {
    const _norm = str => {
      return str.toLowerCase().replace(/ /g, "");
    };
    const { searchInput } = this.props;
    const matchStr = Object.keys(coffee)
      .sort()
      .map(k => _norm(coffee[k]))
      .join("");
    const search = _norm(searchInput);
    return matchStr.indexOf(search) >= 0;
  };

  render() {
    return (
      <FlatList
        data={coffees.filter(this.filterCoffee)}
        renderItem={({ item }) => <Coffee {...item} />}
        keyExtractor={item => item.name}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: 230,
    height: 40,
    padding: 5,
    marginTop: 20,
    marginBottom: 40,
  },
  searchInputActive: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    height: 40,
    padding: 5,
    margin: 30,
  },
});
