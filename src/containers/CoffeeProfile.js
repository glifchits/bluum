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
import { snakeCaseToPresentable } from "../utils/utils";
import { GET_BREWS_FOR_COFFEE } from "../queries";
import {
  FONT_REG,
  FONT_BOLD,
  LIGHT_BROWN,
  BROWN,
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

const TABS = ["Coffee Info", "My Brews"];

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

  renderCoffeeMetadata(coffeeID) {
    const GET_COFFEE = gql`
      query CoffeeDetails($id: ID!) {
        coffee(id: $id) {
          id
          name
          description
          regions
          metadata
        }
      }
    `;

    const Entry = ({ title, value }) =>
      value ? (
        <View style={styles.infoItemContainer}>
          <Text style={styles.infoItemTitle}>{title}</Text>
          <Text style={styles.infoItemValue}>{value}</Text>
        </View>
      ) : null;

    return (
      <View>
        <Query query={GET_COFFEE} variables={{ id: coffeeID }}>
          {({ loading, error, data }) => {
            if (loading) return <Text>Loading...</Text>;
            if (error) return <Text>Error:(</Text>;
            const coffee = data.coffee[0];

            let { regions, description, metadata } = coffee;
            // avoid nulls
            regions = regions || [];
            metadata = metadata || {};
            if (
              !description &&
              !regions.length &&
              !Object.keys(metadata).length
            ) {
              return (
                <View style={{ padding: 20 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: FONT_REG,
                      color: BROWN,
                    }}
                  >
                    We have no additional information about this coffee.
                  </Text>
                </View>
              );
            }

            return (
              <FlatList
                data={[
                  { title: "Description", value: description },
                  { title: "Regions", value: [...regions].sort().join(", ") },
                  ...Object.keys(metadata)
                    .sort()
                    .map(key => ({
                      title: snakeCaseToPresentable(key),
                      value: metadata[key],
                    })),
                ]}
                renderItem={({ item }) => <Entry {...item} />}
                keyExtractor={item => item.title}
              />
            );
          }}
        </Query>
      </View>
    );
  }

  render() {
    // Pulls in coffee from the params passed in from My Coffee screen
    const { params } = this.props.navigation.state;
    const { coffeeID } = params;
    const { sortBy } = this.state;

    const myBrewsBody = (
      <Query query={GET_BREWS_FOR_COFFEE} variables={{ id: coffeeID }}>
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading...</Text>;
          if (error) return <Text>Error :(</Text>;

          const sortedBrews = [...data.brews].sort((a, b) => {
            switch (this.state.sortBy) {
              case "date":
                return new Date(b.created_at) - new Date(a.created_at);
              case "rating":
                return b.rating - a.rating;
              default:
                return a.id - b.id;
            }
          });

          if (sortedBrews.length === 0) {
            return (
              <View style={{ padding: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: FONT_REG,
                    color: BROWN,
                  }}
                >
                  You have not logged any brews with this coffee. Tap "Brew
                  These Beans" to log a brew!
                </Text>
              </View>
            );
          }

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
          <CoffeeSummary coffeeID={coffeeID} />
          <ButtonGroup
            onPress={this.changeTab}
            selectedIndex={this.state.selectedTab}
            buttons={TABS}
            containerStyle={{
              height: 40,
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
          {this.state.selectedTab === 1
            ? myBrewsBody
            : this.renderCoffeeMetadata(coffeeID)}
        </ScrollView>
        <ButtonBar
          buttonText="Brew These Beans"
          onPress={() => this.handleAddBrew(coffeeID)}
        />
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
  headerName: {
    fontSize: 18,
    fontFamily: FONT_REG,
    color: "#fff",
  },
  tab: {
    backgroundColor: "#FAEDE1",
    borderWidth: 0,
  },
  tabText: {
    fontFamily: FONT_BOLD,
    color: LIGHT_BROWN,
    fontSize: 12,
  },
  selectedTab: {
    backgroundColor: "#E7D3C1",
  },
  selectedTabText: {
    fontFamily: FONT_BOLD,
    color: BROWN,
    fontSize: 12,
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
