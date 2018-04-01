import React from "react";
import {
  View,
  Picker,
  PickerIOS,
  Text,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { Icon, Button } from "react-native-elements";

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showIOSPicker: false,
    };

    this.toggleIOSPicker = this.toggleIOSPicker.bind(this);
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

  toggleIOSPicker() {
    const showIOSPicker = !this.state.showIOSPicker;
    this.setState({ showIOSPicker });
  }

  render() {
    const { label, selectedValue, onValueChange, options } = this.props;

    const iOSDropdown = (
      <TouchableWithoutFeedback onPress={this.toggleIOSPicker}>
        <View style={styles.iOSDropdownContainer}>
          <Text>{selectedValue}</Text>
          <Icon name="arrow-drop-down" color="#8b8c8c" />
        </View>
      </TouchableWithoutFeedback>
    );

    const androidPicker = (
      <Picker selectedValue={selectedValue} onValueChange={onValueChange}>
        {this.renderOptions(options)}
      </Picker>
    );

    const iOSActiveDropdown = (
      <View>
        <PickerIOS selectedValue={selectedValue} onValueChange={onValueChange}>
          {this.renderOptions(options)}
        </PickerIOS>
        <Button
          backgroundColor="#8b8c8c"
          color="#fff"
          borderRadius={3}
          title="Done"
          onPress={this.toggleIOSPicker}
        />
      </View>
    );

    const iOSPicker = this.state.showIOSPicker
      ? iOSActiveDropdown
      : iOSDropdown;

    return (
      <View style={styles.container}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={styles.dropdownContainer}>
          {Platform.OS === "android" ? androidPicker : iOSPicker}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  label: {
    width: 60,
    flex: 0,
  },
  dropdownContainer: {
    flex: 3,
  },
  iOSDropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
