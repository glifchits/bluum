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
import t from "tcomb-form-native";
import { _norm } from "../utils/utils";
import coffees from "../testdata/my_coffees";
import { Font } from "expo";

const { Form } = t.form;

class HomeScreen extends React.Component {
  state = { inputValue: "" };

  _handleSearchChange = inputValue => this.setState({ inputValue });

  filterCoffee = coffee => {
    const { inputValue } = this.state;
    const matchStr = Object.keys(coffee)
      .sort()
      .map(k => _norm(coffee[k].toString()))
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
          <Text style={styles.appTitle}>COOL BEANS</Text>
          <TextInput
            key="searchTextInput"
            placeholder="Search coffee"
            onChangeText={this._handleSearchChange}
            style={styles.searchInput}
          />
          <Text style={styles.text}>Recently brewed coffee</Text>
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
            keyExtractor={item => item.id}
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

const CoffeeType = t.struct({
  name: t.String,
  region: t.maybe(t.String),
});

class AddNewCoffee extends React.Component {
  state = {
    form: this.props.navigation.getParam("prevFormState", null),
  };

  onPress = e => {
    const { params } = this.props.navigation.state;
    const roaster = params && params.roaster;
    if (!roaster) {
      console.log("roaster not selected");
      return;
    }
    const { form } = this.state;
    if (!form) {
      console.log("form incomplete");
      return;
    }
    const coffee = {
      ...form,
      roaster,
    };
    console.log("onPress", coffee);
  };

  renderRoaster = () => {
    const { params } = this.props.navigation.state;
    return (
      <Text
        style={{ marginBottom: 20 }}
        onPress={() =>
          this.props.navigation.replace("SelectRoaster", {
            prevFormState: this.state.form,
          })
        }
      >
        {!params || !params.roaster
          ? "No roaster selected"
          : `Roaster: ${params.roaster}`}
      </Text>
    );
  };

  render() {
    return (
      <View style={styles.addContainer}>
        <Form
          value={this.state.form}
          onChange={form => this.setState({ form })}
          type={CoffeeType}
        />
        {this.renderRoaster()}
        <Button onPress={this.onPress} title="Add" />
      </View>
    );
  }
}

class SelectRoaster extends React.Component {
  selectRoaster = roaster => evt => {
    // this.props.navigation.pop();
    this.props.navigation.replace("AddNewCoffee", {
      roaster,
      prevFormState: this.props.navigation.getParam("prevFormState", null),
    });
  };

  render() {
    const roasters = Array.from(new Set(coffees.map(c => c.roaster))).sort();
    return (
      <FlatList
        data={roasters}
        renderItem={({ item }) => (
          <Text style={styles.Roaster} onPress={this.selectRoaster(item)}>
            {item}
          </Text>
        )}
        keyExtractor={i => i}
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
  appTitle: {
    color: "#654241",
    fontSize: 24,
    fontWeight: "700",
    width: 300,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontFamily: "avenir-next-bold",
  },
  text: {
    fontFamily: "avenir-next-regular",
    fontSize: 16,
    color: "#1C1713",
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
  Roaster: {
    height: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
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
  SelectRoaster: {
    screen: SelectRoaster,
    navigationOptions: {
      title: "Select roaster",
    },
  },
});

export default SearchScreen;
