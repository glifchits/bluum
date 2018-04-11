import React, { Fragment } from "react";
import {
  View,
  TextInput,
  Text,
  FlatList,
  StyleSheet,
  Form,
  Button,
  ScrollView,
  Modal,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon } from "react-native-elements";
import {
  FONT_REG,
  FONT_BOLD,
  LIGHT_BROWN,
  OFF_BLACK,
  BORDER_RADIUS,
} from "../styles/common";
import Header from "../components/Header";

export const SearchbarHeader = ({ value, onChange, onGoBack }) => {
  return (
    <Header
      centerComponent={
        <View style={styles.searchBox}>
          {onGoBack ? (
            <Icon
              style={styles.icon}
              type="material"
              name="chevron-left"
              color={LIGHT_BROWN}
              onPress={onGoBack}
            />
          ) : null}
          <TextInput
            autoFocus
            key="searchTextInput"
            autoCorrect={false}
            spellCheck={false}
            value={value}
            placeholder="Search coffee"
            onChangeText={onChange}
            style={styles.searchInput}
            underlineColorAndroid="transparent"
          />
          <Icon
            style={styles.icon}
            type="material"
            name="close"
            color={LIGHT_BROWN}
            onPress={() => onChange("")}
          />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  searchBox: {
    backgroundColor: "#fff",
    borderRadius: BORDER_RADIUS,
    flexDirection: "row",
    padding: 5,
  },
  searchInput: {
    marginLeft: 10,
    color: OFF_BLACK,
    flexGrow: 1,
    fontSize: 18,
  },
  icon: {
    flexGrow: 0,
  },
});

export default SearchbarHeader;
