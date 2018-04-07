import React from "react";
import Router from "./src/Router.js";
import { Font } from "expo";
import { Text } from "react-native";

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
    await Font.loadAsync({
      "avenir-next-regular": require("./src/assets/fonts/AvenirNextLTPro-Regular.otf"),
      "avenir-next-bold": require("./src/assets/fonts/AvenirNextLTPro-Bold.otf"),
    });

    this.setState({ fontLoaded: true });
  }

  render() {
    if (this.state.fontLoaded) {
      return <Router />;
    }
    return <Loader />;
  }
}
