import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Icon } from "react-native-elements";
import {
  LIGHT_BROWN,
  BORDER_RADIUS,
  OFF_BLACK,
  BROWN,
  FONT_REG,
  FONT_BOLD,
} from "../styles/common";
import coffee from "../testdata/my_coffees";
import { filterCoffee } from "../utils/utils";
import CoffeeCard from "../components/CoffeeCard";
import Header from "../components/Header";
import { GET_COFFEES } from "../queries";

const GUTTER = 10;
const WIDTH = Dimensions.get("window").width;

export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: "",
    };

    this.clearSearch = this.clearSearch.bind(this);
    this.handleSelectCoffee = this.handleSelectCoffee.bind(this);
  }

  static navigationOptions = {
    header: null,
  };

  _handleSearchChange = inputValue => this.setState({ inputValue });

  handleSelectCoffee(coffeeID) {
    this.props.navigation.navigate("CoffeeProfile", { coffeeID });
  }

  clearSearch() {
    this.setState({ inputValue: "" });
  }

  render() {
    const { inputValue } = this.state;

    return (
      <View style={styles.screenContainer}>
        <Header
          centerComponent={
            <View style={styles.searchBox}>
              <Icon
                style={styles.icon}
                type="material"
                name="chevron-left"
                color={LIGHT_BROWN}
                onPress={() => this.props.navigation.goBack()}
              />
              <TextInput
                autoFocus
                key="searchTextInput"
                autoCorrect={false}
                spellCheck={false}
                value={inputValue}
                placeholder="Search coffee"
                onChangeText={this._handleSearchChange}
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
          }
        />
        {inputValue.length > 0 ? (
          <TouchableOpacity
            style={styles.addCoffeeContainer}
            onPress={() => this.props.navigation.navigate("AddNewCoffee")}
          >
            <Text
              style={styles.addCoffeePreface}
            >{`Can't find ${inputValue}?`}</Text>
            <View style={styles.addContainer}>
              <Text style={styles.addCoffeeLink}>Add it</Text>
              <Icon
                type="material"
                name="chevron-right"
                color={BROWN}
                size={18}
                style={styles.addArrow}
              />
            </View>
          </TouchableOpacity>
        ) : null}
        <ScrollView style={styles.resultsContainer}>
          <Query
            query={GET_COFFEES}
            variables={{ limit: 10, searchTerm: inputValue }}
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
  screenContainer: {
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
  resultsContainer: {
    padding: GUTTER,
  },
  addCoffeeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2E3D5",
    paddingLeft: GUTTER,
    paddingRight: GUTTER,
    paddingTop: 8,
    paddingBottom: 8,
  },
  addCoffeePreface: {
    color: OFF_BLACK,
    marginRight: 10,
    fontFamily: FONT_REG,
  },
  addCoffeeLink: {
    color: BROWN,
    fontFamily: FONT_BOLD,
  },
  addContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addArrow: {
    margin: 0,
    padding: 0,
  },
});
