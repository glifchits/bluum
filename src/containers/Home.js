import React, { Fragment } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TextInput,
  Button,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "react-native-elements";
import { StackNavigator } from "react-navigation";
import t from "tcomb-form-native";
import { _norm, isLoggedIn } from "../utils/utils";
import coffees from "../testdata/my_coffees";
import {
  OFF_BLACK,
  FONT_REG,
  FONT_BOLD,
  DARK_BROWN,
  BROWN,
  LIGHT_BROWN,
  BORDER_RADIUS,
} from "../styles/common";
import CoffeeCard from "../components/CoffeeCard";
import { GET_LATEST_BREWS } from "../queries";

const { Form } = t.form;
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

const RecentlyBrewed = ({ handleSelectCoffee }) => {
  return (
    <React.Fragment>
      <Text style={styles.text}>Recently brewed coffee</Text>
      <Query query={GET_LATEST_BREWS}>
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading...</Text>;
          if (error) return <Text>Error :(</Text>;
          if (!data.latestBrewedCoffees.length) {
            return (
              <Text style={styles.textNoBrews}>
                Nothing! You should brew something.
              </Text>
            );
          }
          return (
            <FlatList
              data={data.latestBrewedCoffees}
              renderItem={({ item }) => (
                <CoffeeCard
                  coffeeID={item.id}
                  onPress={() => handleSelectCoffee(item.id)}
                />
              )}
              keyExtractor={item => item.id}
            />
          );
        }}
      </Query>
    </React.Fragment>
  );
};

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: "",
      isLoggedIn: false,
    };
  }

  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    this.setState({ isLoggedIn: await isLoggedIn() });
  }

  _handleSelectCoffee = coffeeID => {
    this.props.navigation.navigate("CoffeeProfile", { coffeeID });
  };

  _handleSearchPress = () => {
    this.props.navigation.navigate("Search");
  };

  render() {
    let recentlyBrewed = <Text>Not logged in</Text>;
    if (this.state.isLoggedIn) {
      recentlyBrewed = (
        <RecentlyBrewed handleSelectCoffee={this._handleSelectCoffee} />
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.settingsContainer}>
            <View style={styles.spacer} />
            <TouchableWithoutFeedback onPressIn={()=> this.props.navigation.navigate("AuthLoading")}>
            <Icon style={styles.accountIcon} type="material" name="account-circle" color={LIGHT_BROWN} size={30}/>
            </TouchableWithoutFeedback>
        </View>
        <View style={styles.logoContainer}>
          <Image
            style={styles.halfCup}
            source={require("../assets/images/Half-Cool-Cup.png")}
          />
          <Text style={styles.appTitle}>COOL BEANS</Text>
        </View>
        <View style={styles.defaultContainer}>
          <TouchableWithoutFeedback onPressIn={this._handleSearchPress}>
            <View style={styles.searchContainer}>
              <Icon type="material" name="local-cafe" color={LIGHT_BROWN} />
              <Text style={styles.searchInput}>Search for a coffee</Text>
            </View>
          </TouchableWithoutFeedback>
          {recentlyBrewed}
        </View>
      </View>
    );
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

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  defaultContainer: {
    width: WIDTH * 0.8,
    alignItems: "stretch",
  },
  logoContainer: {
    width: WIDTH,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: HEIGHT * 0.15,
    marginBottom: HEIGHT * 0.1,
  },
  halfCup: {
    position: "absolute",
    left: 0,
  },
  appTitle: {
    color: BROWN,
    fontSize: 36,
    flex: 1,
    textAlign: "center",
    fontFamily: FONT_BOLD,
  },
  text: {
    fontFamily: FONT_REG,
    fontSize: 16,
    color: OFF_BLACK,
  },
  textNoBrews: {
    fontFamily: FONT_REG,
    fontSize: 14,
    color: "#777",
    paddingTop: 10,
  },
  addContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  searchContainer: {
    borderWidth: 1,
    borderColor: LIGHT_BROWN,
    padding: 10,
    backgroundColor: "transparent",
    borderRadius: BORDER_RADIUS,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  searchInput: {
    marginLeft: 10,
    color: LIGHT_BROWN,
    flex: 1,
    fontSize: 18,
  },
  Roaster: {
    height: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  settingsContainer: {
    marginTop: (HEIGHT * 0.05),
    paddingRight: (WIDTH * 0.05),
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  spacer: {
    flex:1,
  },
});

/*
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
});*/
