import React from "react";
import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import Rating from "../components/Rating.js";
import {
  FONT_REG,
  FONT_BOLD,
  BROWN,
  LIGHT_BROWN,
  OFF_BLACK,
} from "../styles/common";

const CUP_SIZE = 125;

export default class CoffeeSummary extends React.Component {
  render() {
    const { coffee } = this.props;
    return (
      <View style={styles.topInfo}>
        <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/Cool-Cup.png")}
            style={styles.cupImage}
          />
          <Text style={styles.cupLetter}>
            {coffee.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.primaryInfo}>
          <Text style={styles.coffeeName}>{coffee.name}</Text>
          <Text style={styles.roaster}>{coffee.roaster.name}</Text>
          <Text style={styles.roastType}>{`${coffee.roast} Roast`}</Text>
          <Rating rating={coffee.rating} ratingCount={5} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  topInfo: {
    flexDirection: "row",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#d9d9d9",
  },
  coffeeName: {
    fontSize: 18,
    fontFamily: FONT_BOLD,
    color: BROWN,
  },
  roaster: {
    fontSize: 16,
    color: OFF_BLACK,
    fontFamily: FONT_REG,
  },
  roastType: {
    fontSize: 14,
    color: OFF_BLACK,
    fontFamily: FONT_REG,
  },
  imageContainer: {
    width: CUP_SIZE,
    height: CUP_SIZE,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 25,
  },
  cupImage: {
    width: CUP_SIZE,
    height: CUP_SIZE,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  cupLetter: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
    fontFamily: FONT_REG,
  },
});
