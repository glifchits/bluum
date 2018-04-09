import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import {
  Icon,
  ButtonGroup,
  List,
  ListItem,
  Button,
} from "react-native-elements";
import Rating from "../components/Rating";
import Dropdown from "../components/Dropdown";
import Header from "../components/Header";
import CoffeeSummary from "../components/CoffeeSummary";
import brews from "../testdata/brews.js";
import { sortCoffee } from "../utils/utils";
import { FONT_REG } from "../styles/common";

const SORT_OPTIONS = [
  { label: "Date", value: "date" },
  { label: "Rating", value: "rating" },
  { label: "Method", value: "method" },
  { label: "Coarseness", value: "coarseness" },
];

const TABS = ["My Brews", "Coffee Info"];

export default class CoffeeProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
      sortBy: "date",
    };

    this.changeTab = this.changeTab.bind(this);
  }

  // Hides default header from StackNavigator and default tabs from TabNavigator
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  changeTab(tab) {
    this.setState({ selectedTab: tab });
  }

  handleSelectBrew(brew, coffee) {
    this.props.navigation.navigate("Brew", {
      brew: brew,
      coffee: coffee,
      editable: false,
    });
  }

  handleAddBrew(coffee) {
    this.props.navigation.navigate("Brew", {
      brew: null,
      coffee: coffee,
      editable: true,
    });
  }

  render() {
    // Pulls in coffee from the params passed in from My Coffee screen
    const { params } = this.props.navigation.state;
    const { coffee } = params;
    const { sortBy } = this.state;

    const sortedBrews = sortCoffee(sortBy, brews);

    const myBrews = sortedBrews.map((brew, index) => {
      return (
        <ListItem
          key={index}
          title={brew.date.value}
          subtitle={
            <View>
              <Text>{brew.notes.value}</Text>
              <Rating rating={brew.rating.value} ratingCount={5} />
            </View>
          }
          onPress={() => this.handleSelectBrew(brew, coffee)}
        />
      );
    });

    const myBrewsBody = (
      <View>
        <Dropdown
          label="Sort by:"
          selectedValue={this.state.sortBy}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({ sortBy: itemValue });
          }}
          options={SORT_OPTIONS}
        />
        <List>{myBrews}</List>
      </View>
    );

    const coffeeInfoBody = (
      <View>
        <List>
          <ListItem
            key="description"
            title="Description"
            subtitle={coffee.description}
            hideChevron
            subtitleNumberOfLines={5}
          />
          <ListItem
            key="origin"
            title="Origin"
            subtitle={coffee.origin}
            hideChevron
            subtitleNumberOfLines={5}
          />
          <ListItem
            key="elevation"
            title="Elevation"
            subtitle={coffee.elevation}
            hideChevron
            subtitleNumberOfLines={5}
          />
        </List>
      </View>
    );

    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon
              type="material"
              name="chevron-left"
              color="#fff"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          centerComponent={<Text style={styles.headerName}>My Coffee</Text>}
        />
        <ScrollView style={styles.body}>
          <CoffeeSummary coffee={coffee} />
          <ButtonGroup
            onPress={this.changeTab}
            selectedIndex={this.state.selectedTab}
            buttons={TABS}
            containerStyle={{ height: 50, marginTop: 20 }}
          />
          {this.state.selectedTab === 0 ? myBrewsBody : coffeeInfoBody}
        </ScrollView>
        <View style={styles.buttonBar}>
          <Button
            fontWeight="700"
            backgroundColor="#8b8c8c"
            color="#fff"
            borderRadius={3}
            title="Add a Brew"
            onPress={() => this.handleAddBrew(coffee)}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  body: {
    padding: 20,
  },
  buttonBar: {
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: "#353535",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderTopWidth: 1,
    borderColor: "#d9d9d9",
  },
  headerName: {
    fontSize: 18,
    fontFamily: FONT_REG,
    color: "#fff",
  },
});
