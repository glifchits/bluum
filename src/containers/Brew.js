import React, { Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { StyleSheet, Text, View, ScrollView, TextInput } from "react-native";
import {
  Header,
  Icon,
  ButtonGroup,
  List,
  ListItem,
  Button,
  Slider,
} from "react-native-elements";
import Rating from "../components/Rating";
import Dropdown from "../components/Dropdown";
import CoffeeSummary from "../components/CoffeeSummary";
import { GET_BREWS_FOR_COFFEE, BREW_FRAGMENT, GET_BREW } from "../queries";

const BREW_METHODS = [
  { label: "Drip", value: "Drip" },
  { label: "Pourover", value: "Pourover" },
  { label: "Chemex", value: "Chemex" },
  { label: "Aeropress", value: "Aeropress" },
  { label: "French Press", value: "French Press" },
  { label: "Espresso", value: "Espresso" },
];

export default class BrewScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: 3,
      method: "Drip",
      notes: "",
      coarseness: 0,
      coffee_weight: "",
      water_weight: "",
    };
  }

  // Hides default header from StackNavigator and default tabs from TabNavigator
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  renderItems(brew) {
    const EntryOrNull = ({ title, value }) =>
      value ? (
        <ListItem key={title} title={title} subtitle={value} hideChevron />
      ) : null;

    return (
      <List style={styles.brewInfo}>
        <EntryOrNull
          title="Brew Date"
          value={new Date(brew.created_at).toDateString()}
        />
        <EntryOrNull title="Notes" value={brew.notes} />
        <EntryOrNull title="Method" value={brew.method} />
        <EntryOrNull
          title="Grind Coarseness"
          value={(brew.metadata || {})["Grind Coarseness"]}
        />
        <EntryOrNull
          title="Coffee Weight (g)"
          value={(brew.metadata || {})["Coffee Weight (g)"]}
        />
        <EntryOrNull
          title="Water Weight (g)"
          value={(brew.metadata || {})["Water Weight (g)"]}
        />
        <EntryOrNull
          title="Flavours"
          value={[...(brew.flavours || [])].sort().join(", ")}
        />
      </List>
    );
  }

  // Need to actually hook this up once we have the data structure worked out
  save() {
    this.props.navigation.goBack();
  }

  renderForm() {
    return (
      <ScrollView style={styles.brewForm}>
        <View style={styles.brewFormRow}>
          <Text style={styles.label}>Your Rating</Text>
          <Slider
            value={this.state.rating}
            onValueChange={value => this.setState({ rating: value })}
            minimumValue={0}
            maximumValue={5}
            step={0.5}
            thumbTintColor="#3e92d4"
            minimumTrackTintColor="#61A5DB"
            maximumTrackTintColor="#e5e5e5"
          />
          <Text>Rating: {this.state.rating}/5</Text>
        </View>
        <View style={styles.brewFormRow}>
          <Text style={styles.label}>Brew Method</Text>
          <Dropdown
            selectedValue={this.state.method}
            onValueChange={(itemValue, itemIndex) => {
              this.setState({ method: itemValue });
            }}
            options={BREW_METHODS}
          />
        </View>
        <View style={styles.brewFormRow}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            onChangeText={text => this.setState({ notes: text })}
            value={this.state.notes}
            placeholder="Enter in some notes"
            multiline
            numberOfLines={4}
          />
        </View>
        <View style={styles.brewFormRow}>
          <Text style={styles.label}>Grind Coarseness</Text>
          <Slider
            value={this.state.coarseness}
            onValueChange={value => this.setState({ coarseness: value })}
            minimumValue={0}
            maximumValue={10}
            step={1}
            thumbTintColor="#3e92d4"
            minimumTrackTintColor="#61A5DB"
            maximumTrackTintColor="#e5e5e5"
          />
          <Text>Rating: {this.state.coarseness}/10</Text>
        </View>
        <View style={styles.brewFormRow}>
          <Text style={styles.label}>Amount of Coffee (g)</Text>
          <TextInput
            onChangeText={text => this.setState({ coffee_weight: text })}
            value={this.state.coffee_weight}
            placeholder="Enter how much coffee you used"
          />
        </View>
        <View style={styles.brewFormRow}>
          <Text style={styles.label}>Amount of Water (g)</Text>
          <TextInput
            onChangeText={text => this.setState({ water_weight: text })}
            value={this.state.water_weight}
            placeholder="Enter how much coffee you used"
          />
        </View>
      </ScrollView>
    );
  }

  render() {
    // Pulls in coffee from the params passed in from My Coffee screen
    const { params } = this.props.navigation.state;
    const { brewID, coffeeID } = params;

    const editable = brewID === null;
    const headerTitle = editable ? "New Brew" : "About This Brew";

    const coffeeDetails = !coffeeID ? (
      <Query query={GET_BREW} variables={{ id: brewID }}>
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading...</Text>;
          if (error) return <Text>Error :(</Text>;
          const brew = data.brews[0];

          return (
            <Fragment>
              <CoffeeSummary coffeeID={brew.coffee.id} />
              {this.renderItems(brew)}
            </Fragment>
          );
        }}
      </Query>
    ) : (
      <Fragment>
        <CoffeeSummary coffeeID={coffeeID} />
        {this.renderForm()}
      </Fragment>
    );

    const ADD_BREW = gql`
      mutation CreateBrew(
        $coffeeID: ID!
        $rating: Float
        $method: String
        $notes: String
        $flavours: [String]
        $metadata: JSON
      ) {
        createBrew(
          coffeeID: $coffeeID
          rating: $rating
          method: $method
          notes: $notes
          flavours: $flavours
          metadata: $metadata
        ) {
          ...Brew
        }
      }
      ${BREW_FRAGMENT}
    `;

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
            text: headerTitle,
            style: { color: "#fff" },
          }}
          outerContainerStyles={{ backgroundColor: "#8b8c8c" }}
          innerContainerStyles={{ justifyContent: "space-between" }}
        />
        <ScrollView style={styles.body}>{coffeeDetails}</ScrollView>
        {editable ? (
          <View style={styles.buttonBar}>
            <Mutation
              mutation={ADD_BREW}
              update={(cache, { data }) => {
                const { brews } = cache.readQuery({
                  query: GET_BREWS_FOR_COFFEE,
                  variables: { id: coffeeID },
                });
                cache.writeQuery({
                  query: GET_BREWS_FOR_COFFEE,
                  variables: { id: coffeeID },
                  data: { brews: [...brews, data.createBrew] },
                });
              }}
              onCompleted={data => {
                // see handleSelectBrew
                this.props.navigation.navigate("Brew", {
                  brewID: data.createBrew.id,
                  coffeeID: null,
                });
              }}
            >
              {(addBrew, { loading, error }) => {
                const { rating, method, notes, ...metadata } = this.state;
                return (
                  <Button
                    fontWeight="700"
                    backgroundColor="#8b8c8c"
                    color="#fff"
                    borderRadius={3}
                    title="Save"
                    loading={!!loading}
                    disabled={!!loading}
                    onPress={e => {
                      addBrew({
                        variables: {
                          coffeeID,
                          rating,
                          method,
                          notes,
                          // flavours
                          metadata,
                        },
                      });
                    }}
                  />
                );
              }}
            </Mutation>
          </View>
        ) : null}
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
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  brewFormRow: {
    paddingTop: 10,
    paddingBottom: 10,
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
