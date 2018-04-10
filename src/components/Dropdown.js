import React from "react";
import {
  View,
  Picker,
  PickerIOS,
  Text,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Modal,
  SafeAreaView,
} from "react-native";
import { Icon, Button } from "react-native-elements";
import {
  FONT_REG,
  FONT_BOLD,
  OFF_BLACK,
  BROWN,
  LIGHT_BROWN,
} from "../styles/common";

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showPicker: false,
    };

    this.togglePicker = this.togglePicker.bind(this);
  }

  renderOptions(options) {
    return options.map(opt => {
      return Platform.OS === "android" ? (
        <Picker.Item label={opt.label} value={opt.value} key={opt.label} />
      ) : (
        <PickerIOS.Item label={opt.label} value={opt.value} key={opt.label} />
      );
    });
  }

  togglePicker() {
    const showPicker = !this.state.showPicker;
    this.setState({ showPicker });
  }

  render() {
    const { label, selectedValue, onValueChange, options, layout } = this.props;

    const dropdown = (
      <TouchableWithoutFeedback onPress={this.togglePicker}>
        <View style={styles.dropdown}>
          <Text style={styles.dropdownLabel}>{selectedValue}</Text>
          <Icon
            type="material"
            name="keyboard-arrow-down"
            color={LIGHT_BROWN}
            size={16}
          />
        </View>
      </TouchableWithoutFeedback>
    );

    const androidPicker = (
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.androidPicker}
      >
        {this.renderOptions(options)}
      </Picker>
    );

    const iOSPicker = (
      <Modal
        onRequestClose={this.togglePicker}
        animationType="slide"
        presentationStyle="formSheet"
      >
        <SafeAreaView style={styles.iOSPickerContainer}>
          <Text style={styles.iOSPickerTitle}>Sort By</Text>
          <PickerIOS
            selectedValue={selectedValue}
            onValueChange={onValueChange}
            itemStyle={styles.iOSPickerItem}
          >
            {this.renderOptions(options)}
          </PickerIOS>
          <Button
            borderRadius={3}
            title="Done"
            onPress={this.togglePicker}
            textStyle={styles.iOSPickerButtonText}
            buttonStyle={styles.iOSPickerButton}
          />
        </SafeAreaView>
      </Modal>
    );

    return (
      <View
        style={
          layout === "block"
            ? blockStyles.blockContainer
            : inlineStyles.container
        }
      >
        {label ? (
          <Text
            style={layout === "block" ? blockStyles.label : inlineStyles.label}
          >
            {label}
          </Text>
        ) : null}
        <View style={styles.dropdownContainer}>
          {Platform.OS === "android" ? androidPicker : dropdown}
        </View>
        {this.state.showPicker && Platform.OS === "ios" ? iOSPicker : null}
      </View>
    );
  }
}

const blockStyles = StyleSheet.create({
  container: {
    flexDirection: "column",
    marginTop: 10,
    marginBottom: 10,
  },
  label: {
    fontFamily: FONT_BOLD,
    color: BROWN,
  },
});

const inlineStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  label: {
    width: 55,
    flex: 0,
    fontFamily: FONT_REG,
  },
});

const styles = StyleSheet.create({
  dropdownContainer: {
    flex: 3,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownLabel: {
    fontFamily: FONT_REG,
    color: LIGHT_BROWN,
  },
  iOSPickerItem: {
    color: OFF_BLACK,
    fontFamily: FONT_REG,
  },
  iOSPickerContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  iOSPickerTitle: {
    fontFamily: FONT_BOLD,
    fontSize: 24,
    color: "#8b8c8c",
    textAlign: "center",
  },
  iOSPickerButton: {
    marginBottom: HEIGHT * 0.1,
    backgroundColor: LIGHT_BROWN,
  },
  iOSPickerButtonText: {
    fontFamily: FONT_BOLD,
  },
});
