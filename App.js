import React from "react";
import ApolloClient from "apollo-boost";
import Router from "./src/Router.js";
import { Font } from "expo";
import { ApolloProvider } from "react-apollo";
import { Text, SafeAreaView, StyleSheet, AsyncStorage } from "react-native";

// defined again in constants.js
const TOKEN_KEY = "@CoolBeansApp:userAuthToken";

class Loader extends React.Component {
  render() {
    return <Text>Loading...</Text>;
  }
}

export default class AppContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fontLoaded: false,
    };
  }

  async componentDidMount() {
    this.client = new ApolloClient({
      uri:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000/graphql"
          : "https://plcczn4vic.execute-api.us-west-1.amazonaws.com/latest/graphql",
      request: async operation => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        operation.setContext({
          headers: {
            authorization: token ? `Bearer ${token}` : "",
          },
        });
      },
    });

    await Font.loadAsync({
      "avenir-next-regular": require("./src/assets/fonts/AvenirNextLTPro-Regular.otf"),
      "avenir-next-bold": require("./src/assets/fonts/AvenirNextLTPro-Bold.otf"),
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    if (this.state.fontLoaded) {
      return (
        <ApolloProvider client={this.client}>
          <SafeAreaView style={styles.SafeArea}>
            <Router />
          </SafeAreaView>
        </ApolloProvider>
      );
    }
    return <Loader />;
  }
}

const styles = StyleSheet.create({
  SafeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
