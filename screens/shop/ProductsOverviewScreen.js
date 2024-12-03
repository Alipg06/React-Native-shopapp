import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import { addToCart } from "../../redux/features/cart/cartSlice";
import Colors from "../../constants/Colors";
import { fetchProductsAsync } from "../../redux/features/products/productsSlice";
import { useFocusEffect } from "@react-navigation/native";

const ProductsOverviewScreen = (props) => {
  const dispatch = useDispatch();
  const { status, error, availableProducts } = useSelector(
    (state) => state.products
  );

  const selectItemHandler = (productId, productTitle) => {
    props.navigation.navigate("ProductDetail", {
      productId,
      productTitle,
    });
  };

  const fetchProcduts = () => {
    dispatch(fetchProductsAsync());
  };

  useFocusEffect(
    useCallback(() => {
      // This code will run whenever the screen is focused
      fetchProcduts();
    }, [])
  );

  if (status === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (status === "failed" || availableProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>No Products Found, Try adding some!</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={availableProducts}
      onRefresh={fetchProcduts}
      refreshing={status === "loading" ? true : false}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemHandler(itemData.item.id, itemData.item.title);
          }}>
          <Button
            color={Colors.primary}
            title="View Details"
            onPress={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              dispatch(addToCart(itemData.item));
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

export default ProductsOverviewScreen;
