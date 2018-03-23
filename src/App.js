import React, { Fragment } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TabNavigator } from "react-navigation";
import SearchScreen from "./SearchScreen";
import MyCoffee from "./MyCoffee";
import Profile from "./Profile";

const App = TabNavigator(
  {
    MyCoffee: {
      screen: MyCoffee,
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
