import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import {
  Header,
  Icon,
  ButtonGroup,
  List,
  ListItem,
  Button,
} from "react-native-elements";
import Rating from "../components/Rating.js";
import Dropdown from "../components/Dropdown";
import CoffeeSummary from "../components/CoffeeSummary";
import brews from "../testdata/brews.js";
import { sortCoffee } from "../utils/utils";

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
            <View>
              <Dropdown
                label="Sort by:"
                selectedValue={this.state.sortBy}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({ sortBy: itemValue });
                }}
                options={SORT_OPTIONS}
              />
              <List>
                {sortedBrews.map(brew => (
                  <ListItem
                    key={brew.id}
                    title={new Date(brew.created_at).toString()}
                    subtitle={
                      <View>
                        <Text>{brew.notes || "<no notes>"}</Text>
                        <Rating rating={brew.rating} ratingCount={5} />
                      </View>
                    }
                    onPress={() => this.handleSelectBrew(brew, coffee)}
                  />
                ))}
              </List>
            </View>
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
                    name="arrow-back"
                    color="#fff"
                    onPress={() => this.props.navigation.goBack()}
                  />
                }
                centerComponent={{
                  text: coffee.name,
                  style: { color: "#fff" },
                }}
                outerContainerStyles={{ backgroundColor: "#8b8c8c" }}
                innerContainerStyles={{ justifyContent: "space-between" }}
              />
              <ScrollView style={styles.body}>
                <CoffeeSummary coffee={coffee} />
                <ButtonGroup
                  onPress={this.changeTab}
                  selectedIndex={this.state.selectedTab}
                  buttons={TABS}
                  containerStyle={{ height: 50, marginTop: 20 }}
                />
                {this.state.selectedTab === 0 ? (
                  myBrewsBody
                ) : (
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
                )}
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
});
