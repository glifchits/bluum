import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Button } from "react-native-elements";
import Rating from "../components/Rating.js";
import {
  FONT_REG,
  FONT_BOLD,
  BROWN,
  LIGHT_BROWN,
  OFF_BLACK,
  BORDER_RADIUS,
} from "../styles/common";

const WIDTH = Dimensions.get("window").width;
const CUP_SIZE = WIDTH * 0.3;

// Replace this with real data
const USER_RATING = null;

export default class CoffeeSummary extends React.Component {
  static propTypes = {
    coffeeID: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      saved: false,
    };
  }

  render() {
    const { coffeeID } = this.props;
    const { saved } = this.state;
    const COFFEE_QUERY = gql`
      query Coffee($coffeeID: ID!) {
        coffee(id: $coffeeID) {
          id
          name
          avgRating
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
                <Rating
                  userRating={USER_RATING}
                  communityRating={coffee.avgRating}
                  ratingCount={5}
                />
                <Button
                  containerViewStyle={styles.buttonContainer}
                  borderRadius={BORDER_RADIUS}
                  title={saved ? "Saved" : "Save this Coffee"}
                  onPress={() => this.setState({ saved: !saved })}
                  textStyle={saved ? styles.savedText : styles.defaultText}
                  buttonStyle={
                    saved ? styles.savedButton : styles.defaultButton
                  }
                />
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
    fontSize: 12,
    color: OFF_BLACK,
    fontFamily: FONT_REG,
    marginBottom: 5,
  },
  roastType: {
    fontSize: 12,
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
  buttonContainer: {
    marginLeft: 0,
    marginTop: 20,
  },
  defaultButton: {
    backgroundColor: LIGHT_BROWN,
  },
  savedButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: LIGHT_BROWN,
  },
  defaultText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: FONT_BOLD,
    marginTop: 0,
  },
  savedText: {
    fontSize: 14,
    color: LIGHT_BROWN,
    fontFamily: FONT_BOLD,
  },
});
