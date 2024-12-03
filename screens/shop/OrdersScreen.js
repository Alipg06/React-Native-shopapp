import React, { useCallback } from "react";
import Colors from "../../constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import OrderItem from "../../components/shop/OrderItem";
import { useFocusEffect } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { fetchOrdersAsync } from "../../redux/features/orders/ordersSlice";

const OrdersScreen = () => {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.orders);

  const fetchOrders = () => {
    dispatch(fetchOrdersAsync());
  };
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  if (status === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (status === "failed" || orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>No Orders Found, Try Placing some!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      onRefresh={fetchOrders}
      refreshing={status === "loading" ? true : false}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <OrderItem
          amount={itemData.item.totalAmount}
          date={itemData.item.date}
          items={itemData.item.items}
        />
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

export default OrdersScreen;
