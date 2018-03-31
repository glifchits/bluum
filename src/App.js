import React, { Fragment } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TabNavigator, StackNavigator } from "react-navigation";
import SearchScreen from "./containers/SearchScreen";
import MyCoffeeScreen from "./containers/MyCoffee.js";
import Profile from "./containers/Profile";
import CoffeeProfileScreen from "./containers/CoffeeProfile";

const MyCoffeeStack = StackNavigator({
  MyCoffee: { screen: MyCoffeeScreen },
  CoffeeProfile: { screen: CoffeeProfileScreen },
});

const App = TabNavigator(
  {
    MyCoffee: {
      screen: MyCoffeeStack,
      path: "/containers/mycoffee",
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
      path: "/containers/",
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
      path: "/containers/profile",
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
