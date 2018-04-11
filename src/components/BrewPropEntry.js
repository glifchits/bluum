import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  FONT_REG,
  FONT_BOLD,
  OFF_BLACK,
  BROWN,
  LIGHT_BROWN,
} from "../styles/common";

const FONT_SIZE = 14;

export default class BrewPropEntry extends React.Component {
  render() {
    return (
      <View style={styles.entry}>
        <Text style={styles.title}>{this.props.title}</Text>
        <Text style={styles.value}>{this.props.value}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  entry: {
    marginTop: 12,
    marginBottom: 12,
  },
  title: {
    fontFamily: FONT_BOLD,
    fontSize: FONT_SIZE,
    color: BROWN,
    marginBottom: 5,
  },
  value: {
    fontFamily: FONT_REG,
    fontSize: FONT_SIZE,
    color: OFF_BLACK,
  },
});
