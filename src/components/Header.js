import React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";
import { LIGHT_BROWN } from "../styles/common";

const STATUS_BAR_OFFSET = 35;
const OUTER_COMPONENT_WIDTH = 30;

export default class Header extends React.Component {
  render() {
    // If there is no left and right components, allow the center component
    // to take up the entire container. Otherwise, keep them to preserve the
    // the layout
    const singleComponent =
      !this.props.leftComponent && !this.props.rightComponent;

    return (
      <View style={styles.headerContainer}>
        {singleComponent ? null : (
          <View style={styles.headerLeft}>{this.props.leftComponent}</View>
        )}
        <View style={styles.headerCenter}>{this.props.centerComponent}</View>
        {singleComponent ? null : (
          <View style={styles.headerRight}>{this.props.rightComponent}</View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: LIGHT_BROWN,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? STATUS_BAR_OFFSET : 12,
    paddingBottom: 12,
    paddingLeft: 10,
    paddingRight: 10,
  },
  headerLeft: {
    flexGrow: 0,
    width: OUTER_COMPONENT_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerRight: {
    flexGrow: 0,
    width: OUTER_COMPONENT_WIDTH,
    alignItems: "center",
    justifyContent: "center",
  },
});
