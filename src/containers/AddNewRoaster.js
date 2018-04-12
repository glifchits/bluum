import React, { Fragment } from "react";
import { Query, Mutation } from "react-apollo";
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
import { CREATE_ROASTER, GET_ROASTERS } from "../queries";

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
            placeholder="What do they call this roaster?"
            value={inputValues.name}
            type="name"
            onChange={this._handleInputChange}
          />
          <FormTextInput
            label="Location"
            placeholder="Where are they located?"
            value={inputValues.location}
            type="location"
            onChange={this._handleInputChange}
          />
          <FormTextInput
            label="Description"
            placeholder="Some text to brag about this roaster"
            value={inputValues.description}
            type="description"
            onChange={this._handleInputChange}
            multiline
            numberOfLines={4}
          />
        </ScrollView>
        <Mutation
          mutation={CREATE_ROASTER}
          update={(cache, { data }) => {
            const { roasters } = cache.readQuery({ query: GET_ROASTERS });
            const newRoasters = [data.createRoaster, ...roasters];
            cache.writeQuery({
              query: GET_ROASTERS,
              data: { roasters: newRoasters },
            });
          }}
          onCompleted={data => this.props.navigation.goBack()}
        >
          {(addRoaster, { loading, error }) => {
            const { inputValues } = this.state;
            const { name, location, description, ...metadata } = inputValues;
            const args = { name, location, description };
            return (
              <ButtonBar
                buttonText="Add This Roaster"
                onPress={() => {
                  addRoaster({ variables: { ...args, metadata } });
                }}
              />
            );
          }}
        </Mutation>
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
    flexGrow: 1,
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
