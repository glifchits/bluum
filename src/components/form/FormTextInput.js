import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import {
  FONT_REG,
  FONT_BOLD,
  OFF_BLACK,
  BROWN,
  LIGHT_BROWN,
} from "../../styles/common";

export default class FormTextInput extends React.Component {
  render() {
    const { label, type, onChange, ...props } = this.props;
    return (
      <View style={styles.formInputContainer}>
        <Text style={styles.formLabel}>{label}</Text>
        <TextInput
          autoCorrect={false}
          spellCheck={false}
          onChangeText={newText => onChange(newText, type)}
          style={styles.formTextInput}
          placeholderTextColor={LIGHT_BROWN}
          underlineColorAndroid="transparent"
          {...props}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formInputContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  formLabel: {
    fontFamily: FONT_BOLD,
    color: BROWN,
    marginBottom: 5,
  },
  formTextInput: {
    fontFamily: FONT_REG,
    color: LIGHT_BROWN,
    fontSize: 16,
  },
});
