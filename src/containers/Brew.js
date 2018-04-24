import React, { Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  FlatList,
} from "react-native";
import {
  Icon,
  ButtonGroup,
  List,
  ListItem,
  Button,
  Slider,
} from "react-native-elements";
import {
  FONT_REG,
  FONT_BOLD,
  LIGHT_BROWN,
  BROWN,
  OFF_BLACK,
  BORDER_RADIUS,
} from "../styles/common";
import Rating from "../components/Rating";
import Dropdown from "../components/Dropdown";
import CoffeeSummary from "../components/CoffeeSummary";
import Header from "../components/Header";
import ButtonBar from "../components/ButtonBar";
import FormTextInput from "../components/form/FormTextInput";
import BrewPropEntry from "../components/BrewPropEntry";
import { snakeCaseToPresentable } from "../utils/utils";
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
      rating: 0,
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
      value ? <BrewPropEntry title={title} value={value} /> : null;

    let { flavours, metadata } = brew;
    flavours = flavours || [];
    metadata = metadata || {};

    return (
      <FlatList
        style={styles.brewInfo}
        data={[
          {
            title: "Brew Date",
            value: new Date(brew.created_at).toDateString(),
          },
          { title: "Notes", value: brew.notes },
          { title: "Method", value: brew.method },
          { title: "Tasting Notes", value: [...flavours].sort().join(", ") },
          ...Object.entries(metadata).map(([k, v]) => ({
            title: snakeCaseToPresentable(k),
            value: v,
          })),
        ]}
        renderItem={({ item }) => <EntryOrNull {...item} />}
        keyExtractor={item => item.title}
      />
    );
  }

  // Need to actually hook this up once we have the data structure worked out
  save() {
    this.props.navigation.goBack();
  }

  renderForm() {
    const { rating, coarseness } = this.state;
    return (
      <ScrollView style={styles.brewForm}>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Your Rating</Text>
          <Slider
            value={rating}
            onValueChange={value => this.setState({ rating: value })}
            minimumValue={0}
            maximumValue={5}
            step={0.5}
            thumbTintColor={BROWN}
            minimumTrackTintColor={LIGHT_BROWN}
            maximumTrackTintColor="#e5e5e5"
          />
          <Text style={styles.rating}>{rating}/5</Text>
        </View>
        <Dropdown
          label="Brew Method"
          selectedValue={this.state.method}
          onValueChange={(itemValue, itemIndex) => {
            this.setState({ method: itemValue });
          }}
          options={BREW_METHODS}
          layout="block"
        />
        <FormTextInput
          label="Notes"
          placeholder="Enter in some notes"
          value={this.state.notes}
          type="coffeeName"
          onChange={text => this.setState({ notes: text })}
          multiline
          numberOfLines={4}
        />
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Grind Coarseness</Text>
          <Slider
            value={coarseness}
            onValueChange={value => this.setState({ coarseness: value })}
            minimumValue={0}
            maximumValue={10}
            step={1}
            thumbTintColor={BROWN}
            minimumTrackTintColor={LIGHT_BROWN}
            maximumTrackTintColor="#e5e5e5"
          />
          <Text style={styles.rating}>{coarseness}/10</Text>
        </View>
        <FormTextInput
          label="Amount of Coffee (g)"
          placeholder="Enter how much coffee you used"
          value={this.state.coffee_weight}
          onChange={text => this.setState({ coffee_weight: text })}
        />
        <FormTextInput
          label="Amount of Water (g)"
          placeholder="Enter how much water you used"
          value={this.state.water_weight}
          onChange={text => this.setState({ water_weight: text })}
        />
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
              type="material"
              name="chevron-left"
              color="#fff"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          centerComponent={<Text style={styles.headerName}>{headerTitle}</Text>}
        />
        <ScrollView style={styles.body}>{coffeeDetails}</ScrollView>
        {editable ? (
          <View style={styles.buttonBar}>
            <Mutation
              mutation={ADD_BREW}
              update={(cache, { data }) => {
                let brew = data.createBrew;
                cache.writeFragment({
                  id: brew.id,
                  fragment: BREW_FRAGMENT,
                  data: brew,
                });
              }}
              refetchQueries={["BrewsForCoffee", "GetLatestBrewedCoffees"]}
              onCompleted={data => {
                // see handleSelectBrew
                this.props.navigation.goBack();
              }}
            >
              {(addBrew, { loading, error }) => {
                const { rating, method, notes, ...metadata } = this.state;
                return (
                  <ButtonBar
                    buttonText="Add This Coffee"
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
  brewForm: {
    paddingTop: 10,
  },
  headerName: {
    fontSize: 18,
    fontFamily: FONT_REG,
    color: "#fff",
  },
  sliderLabel: {
    fontFamily: FONT_BOLD,
    color: BROWN,
    marginBottom: 5,
  },
  sliderContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
});
