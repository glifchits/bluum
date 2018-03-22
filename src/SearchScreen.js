import React, { Fragment } from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TextInput,
  Button,
} from "react-native";
import { StackNavigator } from "react-navigation";
import coffees from "./coffees";

const _norm = str => {
  return str.toLowerCase().replace(/ /g, "");
};

class HomeScreen extends React.Component {
  state = { inputValue: "" };

  _handleSearchChange = inputValue => this.setState({ inputValue });

  filterCoffee = coffee => {
    const { inputValue } = this.state;
    const matchStr = Object.keys(coffee)
      .sort()
      .map(k => _norm(coffee[k]))
      .join("");
    const search = _norm(inputValue);
    return matchStr.indexOf(search) >= 0;
  };

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
      const coffeesToShow = coffees.filter(this.filterCoffee);
      const addNewButton =
        coffeesToShow.length <= 1 ? (
          <Button
            onPress={() => this.props.navigation.navigate("AddNewCoffee")}
            title={`Can't find ${this.state.inputValue}? Add it!`}
          />
        ) : null;
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
          {addNewButton}
          <FlatList
            data={coffeesToShow}
            renderItem={({ item }) => <Coffee {...item} />}
            keyExtractor={item => item.name}
          />
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

class AddNewCoffee extends React.Component {
  render() {
    return (
      <View style={styles.addContainer}>
        <Text>Add a new coffee</Text>
      </View>
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
  addContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
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

const SearchScreen = StackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      header: null,
    },
  },
  AddNewCoffee: {
    screen: AddNewCoffee,
    navigationOptions: {
      title: "Add a new coffee",
    },
  },
});

export default SearchScreen;
