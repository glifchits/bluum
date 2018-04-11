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

export default class AddNewRoaster extends React.Component {
  state = {
    inputValues: {
      roasterName: "",
      roasterLocation: "",
      roasterDescription: "",
    },
  };

  // Hides default header from StackNavigator and default tabs from TabNavigator
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  _handleAddRoaster = () => {
    // Do something
    console.log("_handleAddRoaster", this.state);
  };

  _handleInputChange = (newText, inputName) => {
    let newInputValues = { ...this.state.inputValues };
    newInputValues[inputName] = newText;
    this.setState({ inputValues: newInputValues });
  };

  render() {
    const { inputValues } = this.state;
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
            <Text style={styles.headerName}>Add New Roaster</Text>
          }
        />
        <ScrollView style={styles.body}>
          <FormTextInput
            label="Name (Required)"
            placeholder="What name does this coffee roaster go by?"
            value={inputValues.roasterName}
            type="roasterName"
            onChange={this._handleInputChange}
          />
          <FormTextInput
            label="Location"
            placeholder="Where are they located?"
            value={inputValues.roasterLocation}
            type="roasterLocation"
            onChange={this._handleInputChange}
          />
          <FormTextInput
            label="Description"
            placeholder="Some text to brag about this roaster"
            value={inputValues.roasterDescription}
            type="roasterDescription"
            onChange={this._handleInputChange}
            multiline
            numberOfLines={4}
          />
        </ScrollView>
        <ButtonBar
          buttonText="Add This Roaster"
          onPress={this._handleAddRoaster}
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
});
