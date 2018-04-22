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
import { Profile, SignIn, AuthLoading } from "./containers/Profile";
import CoffeeProfileScreen from "./containers/CoffeeProfile";
import BrewScreen from "./containers/Brew";
import {
  BROWN,
  LIGHT_BROWN,
  FONT_REG,
  SHADOW_COLOR,
  SHADOW_RADIUS,
} from "./styles/common";

const ICON_SIZE = 26;

const MyCoffeeStack = StackNavigator({
  MyCoffee: { screen: MyCoffeeScreen },
  CoffeeProfile: { screen: CoffeeProfileScreen },
  Brew: { screen: BrewScreen },
});

const SearchStack = StackNavigator({
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
});

const ProfileStack = SwitchNavigator(
  {
    AuthLoading: AuthLoading,
    Profile: Profile,
    SignIn: SignIn,
  },
  {
    initialRouteName: "AuthLoading",
  },
);

const Router = TabNavigator(
  {
    MyCoffee: {
      screen: MyCoffeeStack,
      path: "/containers/mycoffee",
      navigationOptions: {
        tabBarLabel: "My Brews",
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            type="material"
            name="local-cafe"
            size={ICON_SIZE}
            color={tintColor}
          />
        ),
      },
    },
    HomeTab: {
      screen: SearchStack,
      path: "/containers/home",
      navigationOptions: {
        tabBarLabel: "Search",
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            type="material"
            name="search"
            size={ICON_SIZE}
            color={tintColor}
          />
        ),
      },
    },
    Profile: {
      screen: ProfileStack,
      path: "/containers/profile",
      navigationOptions: {
        tabBarLabel: "Profile",
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            type="material"
            name="account-circle"
            size={ICON_SIZE}
            color={tintColor}
          />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: true,
      showIcon: true,
      upperCaseLabel: false,
      activeTintColor: BROWN,
      inactiveTintColor: LIGHT_BROWN,
      indicatorStyle: {
        backgroundColor: "transparent",
      },
      labelStyle: {
        fontFamily: FONT_REG,
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
      },
      tabStyle: {
        backgroundColor: "#fff",
      },
      style: {
        backgroundColor: "#fff",
        elevation: 30,
        shadowColor: SHADOW_COLOR,
        shadowRadius: SHADOW_RADIUS,
        shadowOffset: { width: 0, height: -5 },
        borderTopWidth: 1,
        borderColor: "#e5e5e5",
        paddingTop: 5,
        paddingBottom: 5,
      },
    },
    tabBarPosition: "bottom",
    initialRouteName: "HomeTab",
  },
);

export default Router;
