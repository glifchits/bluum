import React, { Fragment } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { Header, List, ListItem, Rating } from "react-native-elements";

import my_coffees from "./my_coffees";

// TO DO: hook up header buttons, add sorting, and search

export default class MyCoffee extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftComponent={{ icon: "arrow-back", color: "#fff" }}
          centerComponent={{ text: "My Coffee", style: { color: "#fff" } }}
          rightComponent={{ icon: "search", color: "#fff" }}
          outerContainerStyles={{ backgroundColor: "#8b8c8c" }}
          innerContainerStyles={{ justifyContent: "space-between" }}
        />
        <List>
          {my_coffees.map((coffee, index) => (
            <ListItem
              key={index}
              title={coffee.name}
              subtitle={
                <View>
                  <Text>{coffee.roaster}</Text>
                  <Rating
                    readonly
                    fractions={1}
                    type="heart"
                    startingValue={coffee.rating}
                    ratingColor="#8b8c8c"
                    imageSize={15}
                  />
                </View>
              }
            />
          ))}
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
});
