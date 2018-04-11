import React, { Fragment } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Form,
  Button,
  FlatList,
  ScrollView,
  Modal,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon, Slider } from "react-native-elements";
import {
  FONT_REG,
  FONT_BOLD,
  LIGHT_BROWN,
  BROWN,
  OFF_BLACK,
  BORDER_RADIUS,
  BORDER_COLOR_GREY,
  SHADOW_COLOR,
  SHADOW_OFFSET,
  SHADOW_RADIUS,
} from "../styles/common";
import Header from "../components/Header";
import ButtonBar from "../components/ButtonBar";
import FormTextInput from "../components/form/FormTextInput";
import Dropdown from "../components/Dropdown";
import coffee from "../testdata/my_coffees";
import SearchbarHeader from "../components/SearchbarHeader";

const ROAST_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Medium", value: "medium" },
  { label: "Dark", value: "dark" },
];

class ShowRoasterModal extends React.Component {
  state = {
    inputValue: "",
  };

  _handleSearchChange = inputValue => this.setState({ inputValue });

  render() {
    const { onSelectRoaster, onAddNewRoaster } = this.props;

    const GET_ROASTERS = gql`
      {
        roasters {
          id
          name
        }
      }
    `;

    return (
      <Modal
        onRequestClose={this.props.onCloseModal}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={{ flex: 1 }}>
          <SearchbarHeader
            value={this.state.inputValue}
            onGoBack={this.props.onGoBack}
            onChange={this._handleSearchChange}
          />
          <View style={{ padding: 10 }}>
            <Query query={GET_ROASTERS}>
              {({ loading, error, data }) => {
                if (loading) return <Text>Loading...</Text>;
                if (error) return <Text>Error :(</Text>;
                return (
                  <FlatList
                    style={{ flexGrow: 1 }}
                    data={data.roasters}
                    renderItem={({ item }) => (
                      <TouchableWithoutFeedback
                        onPress={() => onSelectRoaster(item)}
                      >
                        <View style={styles.card}>
                          <Text>{item.name}</Text>
                        </View>
                      </TouchableWithoutFeedback>
                    )}
                    keyExtractor={item => item.id}
                    ListFooterComponent={
                      <TouchableWithoutFeedback
                        onPress={() => {
                          this.props.onCloseModal();
                          onAddNewRoaster();
                        }}
                      >
                        <View style={styles.card}>
                          <Text style={{ fontFamily: FONT_BOLD }}>
                            Don't see a roaster? Add it!
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
                    }
                  />
                );
              }}
            </Query>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

export default class AddNewCoffee extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValues: {
        coffeeName: "",
        coffeeRoast: "light",
        coffeeDescription: "",
        rating: null,
      },
      selectedRoaster: null,
      showRoasterModal: false,
    };
  }

  // Hides default header from StackNavigator and default tabs from TabNavigator
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  _handleAddCoffee = () => {
    // Do something
  };

  _handleInputChange = (newText, inputName) => {
    let newInputValues = { ...this.state.inputValues };
    newInputValues[inputName] = newText;
    this.setState({ inputValues: newInputValues });
  };

  _handleRoastChange = (itemValue, itemIndex) => {
    let newInputValues = { ...this.state.inputValues };
    newInputValues.coffeeRoast = itemValue;
    this.setState({ inputValues: newInputValues });
  };

  onBeginSelectRoaster = e => this.setState({ showRoasterModal: true });

  onSelectRoaster = roaster => {
    this.setState({
      showRoasterModal: false,
      selectedRoaster: roaster,
    });
  };

  onAddNewRoaster = () => {
    this.props.navigation.navigate("AddNewRoaster");
  };

  onCloseRoasterModal = () => this.setState({ showRoasterModal: false });

  _handleChangeRating = value => {
    let newInputValues = { ...this.state.inputValues };
    newInputValues.rating = value;
    this.setState({ inputValues: newInputValues });
  };

  render() {
    const { inputValues, selectedRoaster } = this.state;
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
            <Text style={styles.headerName}>Add New Coffee</Text>
          }
        />
        <ScrollView style={styles.body}>
          <FormTextInput
            label="Name (Required)"
            placeholder="What’s the name of this coffee?"
            value={inputValues.coffeeName}
            type="coffeeName"
            onChange={this._handleInputChange}
          />
          <TouchableWithoutFeedback onPress={this.onBeginSelectRoaster}>
            <View style={{ marginTop: 10, marginBottom: 20 }}>
              <Text style={{ fontFamily: FONT_BOLD, color: BROWN }}>
                Roaster (Required)
              </Text>
              <Text style={{ fontFamily: FONT_REG, color: LIGHT_BROWN }}>
                {selectedRoaster === null
                  ? "Who roasted this coffee?"
                  : selectedRoaster.name}
              </Text>
            </View>
          </TouchableWithoutFeedback>
          {this.state.showRoasterModal ? (
            <ShowRoasterModal
              onGoBack={this.onCloseRoasterModal}
              onSelectRoaster={this.onSelectRoaster}
              onAddNewRoaster={this.onAddNewRoaster}
              onCloseModal={this.onCloseRoasterModal}
            />
          ) : null}
          <Dropdown
            label="Roast Color (Required)"
            selectedValue={inputValues.coffeeRoast}
            onValueChange={this._handleRoastChange}
            options={ROAST_OPTIONS}
            layout="block"
          />
          <Text style={styles.sectionTitle}>Optional Information</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Rating</Text>
            <Slider
              value={inputValues.rating}
              onValueChange={this._handleChangeRating}
              minimumValue={0}
              maximumValue={5}
              step={0.5}
              thumbTintColor={BROWN}
              minimumTrackTintColor={LIGHT_BROWN}
              maximumTrackTintColor="#e5e5e5"
            />
            {inputValues.rating ? (
              <Text style={styles.rating}>{inputValues.rating}/5</Text>
            ) : null}
          </View>
          <FormTextInput
            label="Description"
            placeholder="Enter a short description for this coffee"
            value={inputValues.coffeeDescription}
            type="coffeeDescription"
            onChange={this._handleInputChange}
            multiline
            numberOfLines={4}
          />
        </ScrollView>
        <ButtonBar
          buttonText="Add This Coffee"
          onPress={this._handleAddCoffee}
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
  sectionTitle: {
    marginTop: 30,
    fontFamily: FONT_REG,
    color: OFF_BLACK,
    marginBottom: 15,
  },
  sliderLabel: {
    fontFamily: FONT_BOLD,
    color: BROWN,
    marginBottom: 5,
  },
  // select roasters
  card: {
    width: "100%",
    borderColor: BORDER_COLOR_GREY,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 5,
    marginBottom: 5,
    shadowColor: SHADOW_COLOR,
    shadowOffset: SHADOW_OFFSET,
    shadowRadius: SHADOW_RADIUS,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
  },
});
