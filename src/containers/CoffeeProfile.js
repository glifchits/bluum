import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import {
  Header,
  Icon,
  ButtonGroup,
  List,
  ListItem,
  Button,
} from "react-native-elements";
import Rating from "../components/Rating.js";
import brews from "../testdata/brews.js";

export default class CoffeeProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 0,
    };

    this.changeTab = this.changeTab.bind(this);
  }

  // Hides default header from StackNavigator and default tabs from TabNavigator
  static navigationOptions = {
    header: null,
    tabBarVisible: false,
  };

  changeTab(tab) {
    this.setState({ selectedTab: tab });
  }

  render() {
    // Pulls in coffee from the params passed in from My Coffee screen
    const { params } = this.props.navigation.state;
    const { coffee } = params;
    const tabs = ["My Brews", "Coffee Info"];

    const results = brews.map((brew, index) => {
      return (
        <ListItem
          key={index}
          title={brew.date}
          subtitle={
            <View>
              <Text>{brew.notes}</Text>
              <Rating rating={brew.rating} ratingCount={5} />
            </View>
          }
        />
      );
    });

    return (
      <View style={styles.container}>
        <Header
          leftComponent={
            <Icon
              name="arrow-back"
              color="#fff"
              onPress={() => this.props.navigation.goBack()}
            />
          }
          centerComponent={{ text: coffee.name, style: { color: "#fff" } }}
          outerContainerStyles={{ backgroundColor: "#8b8c8c" }}
          innerContainerStyles={{ justifyContent: "space-between" }}
        />
        <ScrollView style={styles.body}>
          <View style={styles.topInfo}>
            <View style={styles.dummyImg} />
            <View style={styles.primaryInfo}>
              <Text style={styles.coffeeName}>{coffee.name}</Text>
              <Text style={styles.roaster}>{coffee.roaster}</Text>
              <Text style={styles.roastType}>{`${coffee.roast} Roast`}</Text>
              <Rating rating={coffee.rating} ratingCount={5} />
            </View>
          </View>
          <ButtonGroup
            onPress={this.changeTab}
            selectedIndex={this.state.selectedTab}
            buttons={tabs}
            containerStyle={{ height: 50, marginTop: 20 }}
          />
          <List>{results}</List>
        </ScrollView>
        <View style={styles.buttonBar}>
          <Button
            fontWeight="700"
            backgroundColor="#8b8c8c"
            color="#fff"
            borderRadius={3}
            title="Add a Brew"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  topInfo: {
    flexDirection: "row",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#d9d9d9",
  },
  body: {
    padding: 20,
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
  buttonBar: {
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: "#353535",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    borderTopWidth: 1,
    borderColor: "#d9d9d9",
  },
});
