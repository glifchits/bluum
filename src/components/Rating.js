import React, { Fragment } from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Modal,
  Dimensions,
} from "react-native";
import {
  LIGHT_BROWN,
  BROWN,
  FONT_BOLD,
  FONT_REG,
  OFF_BLACK,
} from "../styles/common";
import { Slider, Button } from "react-native-elements";

const HEIGHT = Dimensions.get("window").height;

export default class Rating extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      modalRating: null,
    };
  }

  renderRating(rating) {
    let ratingArray = [];

    for (var i = 1; i <= this.props.ratingCount; i++) {
      let ratingStyle = i <= rating ? styles.filled : styles.ratingIcon;
      ratingArray.push(<View style={ratingStyle} key={i} />);
    }

    return <View style={styles.container}>{ratingArray}</View>;
  }

  closeModal = () => this.setState({ openModal: false });

  render() {
    const {
      ratingCount,
      userRating,
      communityRating,
      simple,
      coffeeID,
    } = this.props;

    const RATE_COFFEE = gql`
      mutation RateCoffee($coffeeID: ID!, $rating: Float!) {
        rateCoffee(coffeeID: $coffeeID, rating: $rating)
      }
    `;

    if (simple) {
      return (
        <View style={styles.container}>
          {this.renderRating(communityRating)}
        </View>
      );
    }

    if (this.state.openModal) {
      return (
        <Modal
          onRequestClose={this.closeModal}
          animationType="slide"
          presentationStyle="formSheet"
        >
          <View style={modalStyles.container}>
            <Text style={modalStyles.title}>Rate this Coffee</Text>
            <Slider
              value={this.state.modalRating}
              onValueChange={value => this.setState({ modalRating: value })}
              minimumValue={0}
              maximumValue={5}
              step={0.5}
              thumbTintColor={BROWN}
              minimumTrackTintColor={LIGHT_BROWN}
              maximumTrackTintColor="#e5e5e5"
            />
            <Text style={modalStyles.rating}>
              {this.state.modalRating || 0}/5
            </Text>
            <Mutation mutation={RATE_COFFEE}>
              {(rateCoffee, { loading, error }) => {
                return (
                  <Button
                    borderRadius={3}
                    title="Done"
                    loading={!!loading}
                    onPress={() => {
                      let { modalRating } = this.state;
                      if (typeof modalRating !== undefined) {
                        rateCoffee({
                          variables: {
                            coffeeID: coffeeID,
                            rating: modalRating,
                          },
                        });
                      }
                      this.closeModal();
                    }}
                    textStyle={modalStyles.buttonText}
                    buttonStyle={modalStyles.button}
                  />
                );
              }}
            </Mutation>
          </View>
        </Modal>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.ratingWrapper}>
          <Text style={styles.label}>Community Rating</Text>
          {this.renderRating(communityRating)}
        </View>
        <View style={styles.ratingWrapper}>
          <Text style={styles.label}>User Rating</Text>
          {userRating || this.state.modalRating ? (
            this.renderRating(userRating || this.state.modalRating)
          ) : (
            <TouchableWithoutFeedback
              onPress={() => this.setState({ openModal: true })}
            >
              <View>
                <Text style={styles.addRating}>Rate this coffee</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>
    );
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
    backgroundColor: LIGHT_BROWN,
    width: 10,
    height: 10,
    borderRadius: 100,
    marginRight: 2,
  },
  container: {
    flexDirection: "row",
    marginTop: 5,
  },
  ratingWrapper: {
    marginRight: 15,
  },
  label: {
    fontSize: 10,
    fontFamily: FONT_REG,
    color: OFF_BLACK,
  },
  addRating: {
    fontSize: 12,
    fontFamily: FONT_BOLD,
    color: LIGHT_BROWN,
    marginTop: 2,
  },
});

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  title: {
    fontFamily: FONT_BOLD,
    fontSize: 24,
    color: "#8b8c8c",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    marginBottom: 20,
    marginTop: 20,
    backgroundColor: LIGHT_BROWN,
  },
  buttonText: {
    fontFamily: FONT_BOLD,
  },
  rating: {
    alignSelf: "center",
  },
});
