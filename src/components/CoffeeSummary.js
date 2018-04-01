import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import Rating from "../components/Rating.js";

export default class CoffeeSummary extends React.Component {
  render() {
    const { coffee } = this.props;
    return (
      <View style={styles.topInfo}>
        <View style={styles.dummyImg} />
        <View style={styles.primaryInfo}>
          <Text style={styles.coffeeName}>{coffee.name}</Text>
          <Text style={styles.roaster}>{coffee.roaster}</Text>
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
    fontWeight: "bold",
  },
  dummyImg: {
    width: 125,
    height: 125,
    marginRight: 25,
    backgroundColor: "#e5e5e5",
  },
});
