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
  isNotEmpty,
  isPasswordMatched,
  isValidEmail,
} from "../../utils/validationUtils";

import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import { signupAsync } from "../../redux/features/auth/authSlice";

const SignupScreen = (props) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validation state variables
  const [validation, setValidation] = useState({
    email: true,
    password: true,
    confirmPassword: true,
  });

  const [isFormValid, setIsFormValid] = useState(true);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });

    // Update validation state
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
          password: isNotEmpty(value),
        });
      case "confirmPassword":
        setValidation({
          ...validation,
          confirmPassword:
            isNotEmpty(value) && isPasswordMatched(value, form.password),
        });

        break;
      default:
        break;
    }
  };

  //   useEffect(() => {
  //     props.navigation.setParams({ handleSubmit });
  //   }, [form]);

  const handleSubmit = () => {
    // Check if all fields are valid
    const isValid = Object.values(validation).every((isValid) => isValid);

    if (isValid) {
      dispatch(signupAsync(form));
      //   if (editingProduct) {
      //     // dispatch(updateProduct({ id: productId, ...form }));
      //     dispatch(updateProductAsync({ id: productId, ...form }));
      //   } else {
      //     dispatch(addProductAsync(form));
      //     // dispatch(addProduct(form));
      //   }
      //   props.navigation.goBack();
    } else {
      // Set the form as invalid
      setIsFormValid(false);
    }
  };

  //   if (status === "failed") {
  //     return (
  //       <View style={styles.centered}>
  //         <Text style={styles.text}>
  //           Some Error Occured!, Unable to Edit the Product
  //         </Text>
  //       </View>
  //     );
  //   }

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
            label="Email Address*"
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
            label="Password*"
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
            required
            minLength={5}
            autoCapitalize="none"
            isValid={validation.password}
            errorMessage="Invalid Password"
          />
        </View>
        <View style={styles.formControl}>
          <Input
            label="Confirm Password*"
            value={form.confirmPassword}
            onChangeText={(text) => handleChange("confirmPassword", text)}
            secureTextEntry
            required
            minLength={5}
            autoCapitalize="none"
            isValid={validation.confirmPassword}
            errorMessage="Password and Confirm Password not matched"
          />
        </View>
        <View style={styles.buttonsContainer}>
          {status === "loading" ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Button
              title="Signup"
              color={Colors.primary}
              onPress={handleSubmit}
            />
          )}
          <Button
            title="Switch to Login"
            color={Colors.accent}
            onPress={() => {
              props.navigation.navigate("Login");
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

export default SignupScreen;
