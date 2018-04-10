import React from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  Form,
  Button,
  ScrollView,
} from "react-native";
import { Icon } from "react-native-elements";
import {
  FONT_REG,
  FONT_BOLD,
  LIGHT_BROWN,
  OFF_BLACK,
  BORDER_RADIUS,
} from "../styles/common";
import Header from "../components/Header";
import ButtonBar from "../components/ButtonBar";
import FormTextInput from "../components/form/FormTextInput";
import Dropdown from "../components/Dropdown";

const ROAST_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Medium", value: "medium" },
  { label: "Dark", value: "dark" },
];

export default class AddNewCoffee extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputValues: {
        coffeeName: "",
        coffeeRoaster: "",
        coffeeRoast: "light",
        coffeeDescription: "",
      },
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
          <FormTextInput
            label="Roaster (Required)"
            placeholder="Who roasted this coffee?"
            value={inputValues.coffeeRoaster}
            type="coffeeRoaster"
            onChange={this._handleInputChange}
          />
          <Dropdown
            label="Roast Color (Required)"
            selectedValue={inputValues.coffeeRoast}
            onValueChange={this._handleRoastChange}
            options={ROAST_OPTIONS}
            layout="block"
          />
          <Text style={styles.sectionTitle}>Optional Information</Text>
          <FormTextInput
            label="Description"
            placeholder="Enter a short description for this coffee"
            value={inputValues.coffeeDescription}
            type="coffeeDescription"
            onChange={this._handleInputChange}
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
  },
});
