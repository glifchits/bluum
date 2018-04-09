import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { StyleSheet, Text, View, ScrollView, FlatList } from "react-native";
import { Icon, ButtonGroup } from "react-native-elements";
import Rating from "../components/Rating";
import Dropdown from "../components/Dropdown";
import Header from "../components/Header";
import CoffeeSummary from "../components/CoffeeSummary";
import brews from "../testdata/brews.js";
import { sortCoffee } from "../utils/utils";
import {
  FONT_REG,
  FONT_BOLD,
  LIGHT_BROWN,
  OFF_BLACK,
  BORDER_RADIUS,
} from "../styles/common";
import BrewCard from "../components/BrewCard";
import ButtonBar from "../components/ButtonBar";

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
  }

  // Hides default header from StackNavigator and default tabs from TabNavigator
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  changeTab = tab => {
    this.setState({ selectedTab: tab });
  };

  handleSelectBrew(brewID) {
    this.props.navigation.navigate("Brew", {
      brewID,
      coffeeID: null,
    });
  }

  handleAddBrew(coffeeID) {
    this.props.navigation.navigate("Brew", {
      brewID: null,
      coffeeID,
    });
  }

  render() {
    // Pulls in coffee from the params passed in from My Coffee screen
    const { params } = this.props.navigation.state;
    const { coffeeID } = params;
    const { sortBy } = this.state;

    // TODO sort brews on server side with a GraphQL argument
    const GET_BREWS_FOR_COFFEE = gql`
      query BrewsForCoffee($id: ID!) {
        brews(coffee: $id) {
          id
          created_at
          method
          notes
          rating
        }
      }
    `;

    const myBrewsBody = (
      <Query query={GET_BREWS_FOR_COFFEE} variables={{ id: coffeeID }}>
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading...</Text>;
          if (error) return <Text>Error:(</Text>;

          const sortedBrews = [...data.brews].sort((a, b) => {
            switch (this.state.sortBy) {
              case "date":
                return new Date(a.created_at) - new Date(b.created_at);
              case "rating":
                return b.rating - a.rating;
              default:
                return a.id - b.id;
            }
          });

          return (
            <ScrollView>
              <Dropdown
                label="Sort by:"
                selectedValue={this.state.sortBy}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({ sortBy: itemValue });
                }}
                options={SORT_OPTIONS}
              />
              <FlatList
                data={sortedBrews}
                renderItem={({ item }) => (
                  <BrewCard
                    brewID={item.id}
                    onPress={() => this.handleSelectBrew(item.id)}
                  />
                )}
                keyExtractor={item => item.id}
              />
            </ScrollView>
          );
        }}
      </Query>
    );

    const GET_COFFEE = gql`
      query CoffeeDetails($id: ID!) {
        coffee(id: $id) {
          id
          name
          roaster {
            name
          }
        }
      }
    `;

    return (
      <Query query={GET_COFFEE} variables={{ id: coffeeID }}>
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading...</Text>;
          if (error) return <Text>Error:(</Text>;
          const coffee = data.coffee[0];

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
                centerComponent={
                  <Text style={styles.headerName}>My Coffee</Text>
                }
              />
              <ScrollView style={styles.body}>
                <CoffeeSummary coffeeID={coffee.id} />
                <ButtonGroup
                  onPress={this.changeTab}
                  selectedIndex={this.state.selectedTab}
                  buttons={TABS}
                  containerStyle={{
                    height: 50,
                    marginTop: 20,
                    marginLeft: 0,
                    marginRight: 0,
                  }}
                  buttonStyle={styles.tab}
                  textStyle={styles.tabText}
                  selectedButtonStyle={styles.selectedTab}
                  selectedTextStyle={styles.selectedTabText}
                  containerBorderRadius={BORDER_RADIUS}
                />
                {this.state.selectedTab === 0 ? (
                  myBrewsBody
                ) : (
                  <View>
                    <FlatList
                      data={[
                        { title: "Description", value: coffee.description },
                        { title: "Origin", value: coffee.origin },
                      ]}
                      renderItem={({ item }) => (
                        <View style={styles.infoItemContainer}>
                          <Text style={styles.infoItemTitle}>{item.title}</Text>
                          <Text style={styles.infoItemValue}>{item.value}</Text>
                        </View>
                      )}
                      keyExtractor={item => item.title}
                    />
                  </View>
                )}
              </ScrollView>
              <ButtonBar
                buttonText="Add a Brew"
                onPress={() => this.handleAddBrew(coffee.id)}
              />
            </View>
          );
        }}
      </Query>
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
  headerName: {
    fontSize: 18,
    fontFamily: FONT_REG,
    color: "#fff",
  },
  tab: {
    backgroundColor: "#FAEDE1",
  },
  tabText: {
    fontFamily: FONT_BOLD,
    color: LIGHT_BROWN,
  },
  selectedTab: {
    backgroundColor: LIGHT_BROWN,
  },
  selectedTabText: {
    fontFamily: FONT_BOLD,
    color: "#fff",
  },
  infoItemContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  infoItemTitle: {
    fontSize: 14,
    color: LIGHT_BROWN,
    marginBottom: 5,
  },
  infoItemValue: {
    fontSize: 14,
    color: OFF_BLACK,
  },
});
