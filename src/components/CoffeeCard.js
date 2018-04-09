import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import {
  BORDER_COLOR_GREY,
  BORDER_RADIUS,
  SHADOW_COLOR,
  SHADOW_OFFSET,
  SHADOW_RADIUS,
  BROWN,
  OFF_BLACK,
  FONT_REG,
  FONT_BOLD,
} from "../styles/common";
import Rating from "./Rating";

const CUP_SIZE = 70;

const CoffeeCard = ({ coffeeID, onPress }) => {
  const COFFEE_QUERY = gql`
    query Coffee($id: ID!) {
      coffee(id: $id) {
        id
        name
        roaster {
          name
        }
      }
    }
  `;

  return (
    <Query query={COFFEE_QUERY} variables={{ id: coffeeID }}>
      {({ loading, error, data }) => {
        if (loading) return <Text>Loading...</Text>;
        if (error) return <Text>Error:(</Text>;
        const coffee = data.coffee[0];
        return (
          <TouchableOpacity onPress={onPress}>
            <View style={styles.card}>
              <View style={styles.imageContainer}>
                <Image
                  source={require("../assets/images/Cool-Cup.png")}
                  style={styles.cupImage}
                />
                <Text style={styles.cupLetter}>
                  {coffee.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{coffee.name}</Text>
                <Text style={styles.roaster}>{coffee.roaster.name}</Text>
                <Rating rating={coffee.rating} ratingCount={5} />
              </View>
            </View>
          </TouchableOpacity>
        );
      }}
    </Query>
  );
};

CoffeeCard.propTypes = {
  coffeeID: PropTypes.string.isRequired,
};

export default CoffeeCard;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderColor: BORDER_COLOR_GREY,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 5,
    marginBottom: 5,
    shadowColor: SHADOW_COLOR,
    shadowOffset: SHADOW_OFFSET,
    shadowRadius: SHADOW_RADIUS,
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
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
    fontSize: 18,
    textAlign: "center",
  },
  name: {
    fontSize: 16,
    color: BROWN,
    fontFamily: FONT_BOLD,
  },
  roaster: {
    fontSize: 12,
    color: OFF_BLACK,
    fontFamily: FONT_REG,
  },
});
