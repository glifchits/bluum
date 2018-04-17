import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { LIGHT_BROWN, FONT_BOLD, BORDER_RADIUS } from "../styles/common";

export default class ButtonBar extends React.Component {
  render() {
    return (
      <View style={styles.buttonBar}>
        <Button
          borderRadius={BORDER_RADIUS}
          title={this.props.buttonText}
          onPress={this.props.onPress}
          textStyle={styles.text}
          buttonStyle={styles.button}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  button: {
    backgroundColor: LIGHT_BROWN,
  },
  buttonText: {
    fontFamily: FONT_BOLD,
  },
});
