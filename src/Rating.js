import React, { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

export default class Rating extends React.Component {
  render() {
    const { ratingCount, rating } = this.props;

    let ratingArray = [];

    for (var i = 1; i <= ratingCount; i++) {
      let ratingStyle = i <= rating ? styles.filled : styles.ratingIcon;
      ratingArray.push(<View style={ratingStyle} key={i} />);
    }

    return <View style={styles.container}>{ratingArray}</View>;
  }
}

const styles = StyleSheet.create({
  ratingIcon: {
    backgroundColor: "#e5e5e5",
    width: 10,
    height: 10,
    borderRadius: 100,
    marginRight: 2,
  },
  filled: {
    backgroundColor: "#3e92d4",
    width: 10,
    height: 10,
    borderRadius: 100,
    marginRight: 2,
  },
  container: {
    flexDirection: "row",
    marginTop: 5,
  },
});
