import React from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  Form,
  Button,
} from "react-native";

export default class AddNewCoffee extends React.Component {
  /*
  state = {
    form: this.props.navigation.getParam("prevFormState", null),
  };

  onPress = e => {
    const { params } = this.props.navigation.state;
    const roaster = params && params.roaster;
    if (!roaster) {
      console.log("roaster not selected");
      return;
    }
    const { form } = this.state;
    if (!form) {
      console.log("form incomplete");
      return;
    }
    const coffee = {
      ...form,
      roaster,
    };
    console.log("onPress", coffee);
  };

  renderRoaster = () => {
    const { params } = this.props.navigation.state;
    return (
      <Text
        style={{ marginBottom: 20 }}
        onPress={() =>
          this.props.navigation.replace("SelectRoaster", {
            prevFormState: this.state.form,
          })
        }
      >
        {!params || !params.roaster
          ? "No roaster selected"
          : `Roaster: ${params.roaster}`}
      </Text>
    );
  };
  */

  render() {
    return (
      /*
      <View>
        <Form
          value={this.state.form}
          onChange={form => this.setState({ form })}
        />
        {this.renderRoaster()}
        <Button onPress={this.onPress} title="Add" />
      </View>
      */
      <View>
        <Text>Add New Coffee</Text>
      </View>
    );
  }
}
