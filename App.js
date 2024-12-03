import "react-native-gesture-handler";
import { useState, useEffect } from "react";
import * as Font from "expo-font";
import { Provider, useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { DrawerActions, NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { store } from "./redux/store";
import Colors from "./constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { useIsLoggedIn } from "./hooks/auth";
import CartScreen from "./screens/shop/CartScreen";
import SignScreen from "./screens/user/SigninScreen";
import OrdersScreen from "./screens/shop/OrdersScreen";
import SignupScreen from "./screens/user/SignupScreen";
import CustomHeaderButton from "./components/UI/HeaderButton";
import UserProductScreen from "./screens/user/UserProductScreen";
import EditProductScreen from "./screens/user/EditProductScreen";
import ProductDetailScreen from "./screens/shop/ProductDetailScreen";
import ProductsOverviewScreen from "./screens/shop/ProductsOverviewScreen";
import StartupScreen from "./screens/StartupScreen";
import { Text } from "react-native";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Products"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
          color: "white",
          fontFamily: "open-sans-bold",
        },
      }}>
      <Drawer.Screen
        name="Products"
        component={ShopStackNavigator}
        options={() => ({
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="md-cart" color={color} size={size} />
          ),
        })}
      />
      <Drawer.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          headerTitle: "Your Orders",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="md-list" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Admin"
        component={UserStackNavigator}
        options={{
          headerShown: false,
          drawerIcon: ({ color, size }) => (
            <Ionicons name="md-create" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function ShopStackNavigator() {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const { items } = useSelector((state) => state.cart);
  useEffect(() => {
    if (items) {
      let total = 0;
      for (const productId in items) {
        if (items.hasOwnProperty(productId)) {
          total += items[productId].quantity;
        }
      }
      setTotalQuantity(total);
    } else {
      // Handle the case where items is undefined or not in the expected format
      setTotalQuantity(0);
    }
  }, [items]);

  return (
    <Stack.Navigator
      initialRouteName="ProductsOverview"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
          color: "white",
          fontFamily: "open-sans-bold",
        },
      }}>
      <Stack.Screen
        name="ProductsOverview"
        initialParams={{ totalQuantity }}
        component={ProductsOverviewScreen}
        options={(props) => ({
          headerTitle: "Products",

          headerLeft: () => (
            <HeaderButtons
              {...props}
              HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Menu"
                iconName="ios-menu"
                onPress={() => {
                  props.navigation.dispatch(DrawerActions.toggleDrawer());
                }}
              />
            </HeaderButtons>
          ),

          headerRight: () => (
            <HeaderButtons
              {...props}
              HeaderButtonComponent={(headerProps) => (
                <CustomHeaderButton count={totalQuantity} {...headerProps} />
              )}>
              <Item
                title="Cart"
                iconName="md-cart"
                onPress={() => {
                  props.navigation.navigate("Cart");
                }}
              />
            </HeaderButtons>
          ),
        })}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={(props) => ({
          headerTitle: props.route.params.productTitle,
        })}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={(props) => ({
          headerTitle: "Your Cart",
        })}
      />
    </Stack.Navigator>
  );
}

function UserStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="UserProducts"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
          color: "white",
          fontFamily: "open-sans-bold",
        },
      }}>
      <Stack.Screen
        name="UserProducts"
        component={UserProductScreen}
        options={(props) => ({
          headerTitle: "Your Products",
          headerLeft: () => (
            <HeaderButtons
              {...props}
              HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Menu"
                iconName="ios-menu"
                onPress={() => {
                  props.navigation.dispatch(DrawerActions.toggleDrawer());
                }}
              />
            </HeaderButtons>
          ),
          headerRight: () => (
            <HeaderButtons
              {...props}
              HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Add"
                iconName="md-create"
                onPress={() => {
                  props.navigation.navigate("EditProduct");
                }}
              />
            </HeaderButtons>
          ),
        })}
      />
      <Stack.Screen
        name="EditProduct"
        component={EditProductScreen}
        options={(props) => ({
          headerTitle: props?.route?.params?.productId
            ? "Edit Product"
            : "Add Product",
          headerRight: () => (
            <HeaderButtons
              {...props}
              HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Save"
                iconName="md-save"
                onPress={() => {
                  props?.route?.params?.handleSubmit();
                }}
              />
            </HeaderButtons>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

function AuthStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Startup"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
          color: "white",
          fontFamily: "open-sans-bold",
        },
        headerTitleAlign: "center",
      }}>
      <Stack.Screen
        name="Startup"
        component={StartupScreen}
        options={(props) => ({
          headerShown: false,
        })}
      />
      <Stack.Screen
        name="Login"
        component={SignScreen}
        options={(props) => ({
          headerTitle: "Login to Application",
          headerLeft: null,
        })}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={(props) => ({
          headerTitle: "Signup to Application",
        })}
      />
    </Stack.Navigator>
  );
}

const Navigator = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  useEffect(() => {}, [isLoggedIn]);

  return isLoggedIn ? <MyDrawer /> : <AuthStackNavigator />;
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
          "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar style="light" />
          <Navigator />
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}
