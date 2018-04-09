import React, { Fragment } from "react";
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

export default class BrewCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { brewID, onPress } = this.props;

    const GET_BREW = gql`
      query Brew($id: ID!) {
        brews(id: $id) {
          id
          method
          metadata
          created_at
          notes
          flavours
        }
      }
    `;

    return (
      <TouchableOpacity onPress={onPress}>
        <Query query={GET_BREW} variables={{ id: brewID }}>
          {({ loading, error, data }) => {
            if (loading) return <Text>Loading...</Text>;
            if (error) return <Text>Error :(</Text>;
            const brew = data.brews[0];
            return (
              <View style={styles.card}>
                <View style={styles.titleRow}>
                  <Text style={styles.title}>
                    {new Date(brew.created_at).toDateString()}
                  </Text>
                  <Rating rating={brew.rating} ratingCount={5} />
                </View>
                <View style={styles.body}>
                  <Text style={styles.notes}>{brew.notes || "<no notes>"}</Text>
                </View>
              </View>
            );
          }}
        </Query>
      </TouchableOpacity>
    );
  }
}

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
    backgroundColor: "#fff",
    alignItems: "stretch",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    fontFamily: FONT_BOLD,
    color: BROWN,
  },
  body: {
    flex: 1,
  },
  notes: {
    fontSize: 14,
    fontFamily: FONT_REG,
    color: OFF_BLACK,
  },
});
