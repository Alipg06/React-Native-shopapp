import React from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";

const Input = ({
  label,
  value,
  onChangeText,
  isValid,
  errorMessage,
  ...props
}) => {
  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, !isValid ? styles.inputInvalid : null]}
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
      {!isValid && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  inputInvalid: {
    borderBottomColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

export default Input;
