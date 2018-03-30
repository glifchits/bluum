import React, { Fragment } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TabNavigator, StackNavigator } from "react-navigation";
import SearchScreen from "./SearchScreen";
import MyCoffeeScreen from "./MyCoffee";
import Profile from "./Profile";
import CoffeeProfileScreen from "./CoffeeProfile";

const MyCoffeeStack = StackNavigator({
  MyCoffee: { screen: MyCoffeeScreen },
  CoffeeProfile: { screen: CoffeeProfileScreen },
});

const App = TabNavigator(
  {
    MyCoffee: {
      screen: MyCoffeeStack,
      path: "/mycoffee",
      navigationOptions: {
        tabBarLabel: "My Brews",
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? "ios-flask" : "ios-flask-outline"}
            size={26}
            style={{ color: tintColor }}
          />
        ),
      },
    },
    HomeTab: {
      screen: SearchScreen,
      path: "/",
      navigationOptions: {
        tabBarLabel: "Search",
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? "ios-search" : "ios-search-outline"}
            size={26}
            style={{ color: tintColor }}
          />
        ),
      },
    },
    Profile: {
      screen: Profile,
      path: "/profile",
      navigationOptions: {
        tabBarLabel: "Profile",
        tabBarIcon: ({ tintColor, focused }) => (
          <Ionicons
            name={focused ? "ios-person" : "ios-person-outline"}
            size={26}
            style={{ color: tintColor }}
          />
        ),
      },
    },
  },
  {
    tabBarOptions: {
      showLabel: true,
    },
    tabBarPosition: "bottom",
    initialRouteName: "HomeTab",
  },
);

export default App;
