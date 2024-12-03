import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  isCharactersLong,
  isNotEmpty,
  isValidEmail,
} from "../../utils/validationUtils";

import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import { signinAsync } from "../../redux/features/auth/authSlice";

const SignScreen = (props) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [validation, setValidation] = useState({
    email: true,
    password: true,
  });

  const [isFormValid, setIsFormValid] = useState(true);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });
    switch (name) {
      case "email":
        setValidation({
          ...validation,
          email: isNotEmpty(value) && isValidEmail(value),
        });
        break;
      case "password":
        setValidation({
          ...validation,
          password: isNotEmpty(value) && isCharactersLong(value, 6),
        });
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    const isValid = Object.values(validation).every((isValid) => isValid);

    if (isValid) {
      dispatch(signinAsync(form));
    } else {
      setIsFormValid(false);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error, [{ text: "Okay" }]);
    }
  }, [error]);

  return (
    <ScrollView>
      <View style={styles.form}>
        {!isFormValid && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>
              Please fix the errors in the form.
            </Text>
          </View>
        )}
        <View style={styles.formControl}>
          <Input
            label="Email Address"
            value={form.email}
            keyboardtype="email-address"
            onChangeText={(text) => handleChange("email", text)}
            autoCapitalize="none"
            required
            email
            isValid={validation.email}
            errorMessage="Invalid Email Address"
          />
        </View>
        <View style={styles.formControl}>
          <Input
            label="Password"
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
            required
            minLength={6}
            autoCapitalize="none"
            isValid={validation.password}
            errorMessage="(Invalid Password) must be atleast 6 charcters long."
          />
        </View>
        <View style={styles.buttonsContainer}>
          {status === "loading" ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Button
              title="Login"
              color={Colors.primary}
              onPress={handleSubmit}
            />
          )}

          <Button
            title="Switch to Sign Up"
            color={Colors.accent}
            onPress={() => {
              props.navigation.navigate("Signup");
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  formControl: {
    width: "100%",
  },
  banner: {
    backgroundColor: "red",
    padding: 10,
    marginBottom: 10,
  },
  bannerText: {
    color: "white",
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  text: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
    textAlign: "center",
  },
  buttonsContainer: {
    gap: 5,
    marginVertical: 5,
  },
});

export default SignScreen;
