import React, { useCallback } from "react";
import Colors from "../../constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { deleteProductFromCart } from "../../redux/features/cart/cartSlice";
import {
  deleteProductAsync,
  fetchProductsAsync,
} from "../../redux/features/products/productsSlice";
import { useFocusEffect } from "@react-navigation/native";

const UserProductScreen = (props) => {
  const dispatch = useDispatch();
  const { userProducts, status } = useSelector((state) => state.products);

  const fetchProducts = () => {
    dispatch(fetchProductsAsync());
  };

  useFocusEffect(
    useCallback(() => {
      // This code will run whenever the screen is focused
      fetchProducts();
    }, [])
  );

  if (status === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (status === "failed" || userProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>
          No User Products Found, Try adding some!
        </Text>
      </View>
    );
  }

  const editItemHandler = (productId, productTitle) => {
    props.navigation.navigate("EditProduct", {
      productId,
      productTitle,
    });
  };

  const deleteHandler = (productId) => {
    return Alert.alert(
      "Are you sure?",
      "Do you really want to delete this item",
      [
        {
          text: "No",
          style: "default",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => {
            dispatch(deleteProductAsync({ productId }));
            // dispatch(deleteProduct({ productId }));
            dispatch(deleteProductFromCart({ productId }));
          },
        },
      ]
    );
  };

  return (
    <FlatList
      data={userProducts}
      onRefresh={fetchProducts}
      refreshing={status === "loading" ? true : false}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            editItemHandler(itemData.item.id, itemData.item.title);
          }}>
          <Button
            color={Colors.primary}
            title="Edit"
            onPress={() => {
              editItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="Delete"
            onPress={() => {
              deleteHandler(itemData.item.id);
            }}
          />
        </ProductItem>
      )}
    />
  );
};

const styles = StyleSheet.create({
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

export default UserProductScreen;
