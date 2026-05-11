import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./src/screens/HomeScreen";
import InvestmentScreen from "./src/screens/InvestmentScreen";
import BusinessScreen from "./src/screens/BusinessScreen";
import CollectionScreen from "./src/screens/CollectionScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#0D1B2A",
            borderTopColor: "#1A2744",
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: "#F4C430",
          tabBarInactiveTintColor: "#4A5568",
          tabBarLabelStyle: {
            fontSize: 11,
          },
        }}
      >
        <Tab.Screen
          name="Ana Ekran"
          component={HomeScreen}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>{"🏠"}</Text>,
          }}
        />
        <Tab.Screen
          name="Yatırım"
          component={InvestmentScreen}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>{"📈"}</Text>,
          }}
        />
        <Tab.Screen
          name="İşletme"
          component={BusinessScreen}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>{"🏢"}</Text>,
          }}
        />
        <Tab.Screen
          name="Koleksiyon"
          component={CollectionScreen}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>{"💎"}</Text>,
          }}
        />
        <Tab.Screen
          name="Profil"
          component={ProfileScreen}
          options={{
            tabBarIcon: () => <Text style={{ fontSize: 20 }}>{"👤"}</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
