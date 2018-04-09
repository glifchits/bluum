import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";
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
  static propTypes = {
    coffeeID: PropTypes.string.isRequired,
  };

  render() {
    const { coffeeID } = this.props;
    const COFFEE_QUERY = gql`
      query Coffee($coffeeID: ID!) {
        coffee(id: $coffeeID) {
          id
          name
          roast_style
          roast_type
          roaster {
            name
          }
        }
      }
    `;

    return (
      <Query query={COFFEE_QUERY} variables={{ coffeeID }}>
        {({ loading, error, data }) => {
          if (loading) return <Text>Loading...</Text>;
          if (error) return <Text>Error :(</Text>;
          const coffee = data.coffee[0];

          const roastDescription = [];
          const { roast_type, roast_style } = coffee;
          if (roast_type) roastDescription.push(roast_type);
          if (roast_style) roastDescription.push(`${roast_style} Roast`);
          const roastInfo = roastDescription ? (
            <Text style={styles.roastType}>{roastDescription.join(", ")}</Text>
          ) : null;

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
                {roastInfo}
                <Rating rating={coffee.rating} ratingCount={5} />
              </View>
            </View>
          );
        }}
      </Query>
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
