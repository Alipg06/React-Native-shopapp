import React, { useEffect } from "react";

import {
  Text,
  View,
  Alert,
  Button,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Colors from "../../constants/Colors";
import CartItem from "../../components/shop/CartItem";
import { clearCart, removeFromCart } from "../../redux/features/cart/cartSlice";
import { addOrderAsync } from "../../redux/features/orders/ordersSlice";

const CartScreen = () => {
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { status: orderStatus, error: orderError } = useSelector(
    (state) => state.orders
  );

  const transformedCartItems = Object.keys(items).map((productId) => ({
    productId,
    ...items[productId],
  }));

  const handleOrder = () => {
    if (totalAmount <= 0 || transformedCartItems.length <= 0) {
      Alert.alert(
        "An error occurred",
        "Please add some items to the cart to place an order!",
        [{ text: "Okay" }]
      );
      return;
    }
    dispatch(addOrderAsync({ items: transformedCartItems, totalAmount }));
    dispatch(clearCart());
  };

  useEffect(() => {
    if (orderError) {
      Alert.alert("An error occurred", orderError, [{ text: "Okay" }]);
    }
  }, [orderError]);

  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:
          <Text style={styles.amount}>${Number(totalAmount).toFixed(2)}</Text>
        </Text>
        {orderStatus === "loading" ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Button
            color={Colors.accent}
            title="Order Now"
            onPress={handleOrder}
          />
        )}
      </View>
      <View>
        <FlatList
          data={transformedCartItems}
          keyExtractor={(item) => item.productId}
          renderItem={(itemData) => (
            <CartItem
              quantity={itemData.item.quantity}
              title={itemData.item.productTitle}
              amount={itemData.item.sum}
              deleteable
              onRemove={() => {
                dispatch(
                  removeFromCart({ productId: itemData.item.productId })
                );
              }}
            />
          )}
        />
      </View>
    </View>
  );
};

// Styles
const styles = {
  screen: {
    flex: 1,
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  amount: {
    color: Colors.primary,
  },
};

export default CartScreen;
