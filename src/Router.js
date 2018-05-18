import React, { Fragment } from "react";
import { Icon } from "react-native-elements";
import {
  TabNavigator,
  StackNavigator,
  SwitchNavigator,
} from "react-navigation";
import HomeScreen from "./containers/Home";
import SearchScreen from "./containers/SearchScreen";
import MyCoffeeScreen from "./containers/MyCoffee.js";
import AddNewCoffee from "./containers/AddNewCoffee.js";
import AddNewRoaster from "./containers/AddNewRoaster.js";
import { Profile, SignIn, SignUp, AuthLoading } from "./containers/Profile";
import CoffeeProfileScreen from "./containers/CoffeeProfile";
import BrewScreen from "./containers/Brew";
import {
  BROWN,
  LIGHT_BROWN,
  FONT_REG,
  SHADOW_COLOR,
  SHADOW_RADIUS,
} from "./styles/common";

const Router = StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Search: {
    screen: SearchScreen,
  },
  AddNewCoffee: {
    screen: AddNewCoffee,
  },
  AddNewRoaster: {
    screen: AddNewRoaster,
  },
  AuthLoading: {
    screen: AuthLoading,
  },

});

export default Router;
