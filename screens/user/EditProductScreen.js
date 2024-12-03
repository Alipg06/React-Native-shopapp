import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  addProductAsync,
  updateProduct,
  updateProductAsync,
} from "../../redux/features/products/productsSlice";

import {
  isNotEmpty,
  isPriceValid,
  isUrlValid,
} from "../../utils/validationUtils";

import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";

const EditProductScreen = (props) => {
  const { productId } = props?.route?.params || {};
  const dispatch = useDispatch();
  const { status, userProducts, error } = useSelector(
    (state) => state.products
  );

  const { userId } = useSelector((state) => state.auth);

  const editingProduct = productId
    ? userProducts.find((product) => product.id === productId)
    : null;

  const [form, setForm] = useState({
    title: editingProduct ? editingProduct.title : "",
    imageUrl: editingProduct ? editingProduct.imageUrl : "",
    price: editingProduct ? editingProduct.price.toString() : "",
    description: editingProduct ? editingProduct.description : "",
    ownerId: userId,
  });

  // Validation state variables
  const [validation, setValidation] = useState({
    title: true,
    imageUrl: true,
    price: true,
    description: true,
  });

  const [isFormValid, setIsFormValid] = useState(true);

  const handleChange = (name, value) => {
    setForm({ ...form, [name]: value });

    // Update validation state
    switch (name) {
      case "title":
        setValidation({
          ...validation,
          title: isNotEmpty(value),
        });
        break;
      case "imageUrl":
        setValidation({
          ...validation,
          imageUrl: isNotEmpty(value) && isUrlValid(value),
        });
        break;
      case "price":
        setValidation({
          ...validation,
          price: isNotEmpty(value) && isPriceValid(value),
        });
        break;
      case "description":
        setValidation({ ...validation, description: isNotEmpty(value) });
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    props.navigation.setParams({ handleSubmit });
  }, [form]);

  const handleSubmit = () => {
    // Check if all fields are valid
    const isValid = Object.values(validation).every((isValid) => isValid);

    if (isValid) {
      if (editingProduct) {
        // dispatch(updateProduct({ id: productId, ...form }));
        dispatch(updateProductAsync({ id: productId, ...form }));
      } else {
        dispatch(addProductAsync(form));
        // dispatch(addProduct(form));
      }
      props.navigation.goBack();
    } else {
      // Set the form as invalid
      setIsFormValid(false);
    }
  };

  if (status === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (status === "failed") {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>
          Some Error Occured!, Unable to Edit the Product
        </Text>
      </View>
    );
  }

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
            label="Title*"
            value={form.title}
            onChangeText={(text) => handleChange("title", text)}
            autoCapitalize="sentences"
            autoCorrect
            isValid={validation.title}
            errorMessage="Title is required"
          />
        </View>
        <View style={styles.formControl}>
          <Input
            label="Image Url*"
            value={form.imageUrl}
            onChangeText={(text) => handleChange("imageUrl", text)}
            isValid={validation.imageUrl}
            errorMessage="Invalid URL."
          />
        </View>
        {editingProduct ? null : (
          <View style={styles.formControl}>
            <Input
              label="Price*"
              value={form.price}
              onChangeText={(text) => handleChange("price", text)}
              keyboardType="numeric"
              isValid={validation.price}
              errorMessage="Price must be greater than 0."
            />
          </View>
        )}

        <View style={styles.formControl}>
          <Input
            label="Description*"
            value={form.description}
            onChangeText={(text) => handleChange("description", text)}
            isValid={validation.description}
            errorMessage="Description is required."
            multiline
            numberOfLines={3}
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
});

export default EditProductScreen;
