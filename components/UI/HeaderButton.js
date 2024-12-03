import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { HeaderButton } from "react-navigation-header-buttons";
import { View, Text, StyleSheet } from "react-native";

const CustomHeaderButton = ({ count = 0, ...props }) => {
  return (
    <View style={styles.container}>
      <HeaderButton
        {...props}
        IconComponent={Ionicons}
        iconSize={30}
        color="white"
      />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count >= 100 ? "99+" : count}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    backgroundColor: "red",
    borderRadius: 15,
    width: 30,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    position: "absolute",
    right: -10,
    top: -10,
  },
  badgeText: {
    color: "white",
    fontSize: 14,
  },
});

export default CustomHeaderButton;
