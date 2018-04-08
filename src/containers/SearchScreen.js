import React from "react";
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

const STATUS_BAR_OFFSET = 35;
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

  handleSelectCoffee(coffee) {
    this.props.navigation.navigate("CoffeeProfile", {
      coffee: coffee,
    });
  }

  clearSearch() {
    this.setState({ inputValue: "" });
  }

  render() {
    const { inputValue } = this.state;
    const filteredCoffee = coffee.filter(coffee =>
      filterCoffee(coffee, inputValue),
    );

    return (
      <View style={styles.screenContainer} forceInset={{ top: "always" }}>
        <View style={styles.searchBarContainer}>
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
        </View>
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
          <FlatList
            data={filteredCoffee}
            renderItem={({ item }) => (
              <CoffeeCard coffee={item} onPress={this.handleSelectCoffee} />
            )}
            keyExtractor={item => item.id}
          />
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
  searchBarContainer: {
    backgroundColor: LIGHT_BROWN,
    padding: GUTTER,
    paddingTop: Platform.OS === "android" ? STATUS_BAR_OFFSET : GUTTER,
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
