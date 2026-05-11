import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useGameStore } from "./src/store/useGameStore";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import HomeScreen from "./src/screens/HomeScreen";
import InvestmentScreen from "./src/screens/InvestmentScreen";
import BusinessScreen from "./src/screens/BusinessScreen";
import ShopScreen from "./src/screens/ShopScreen";
import LeaderboardScreen from "./src/screens/LeaderboardScreen";
import MoreScreen from "./src/screens/MoreScreen";
import CollectionScreen from "./src/screens/CollectionScreen";
import AchievementScreen from "./src/screens/AchievementScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const MoreStack = createNativeStackNavigator();

function MoreStackScreen() {
  return (
    <MoreStack.Navigator screenOptions={{ headerShown: false }}>
      <MoreStack.Screen name="MoreHub" component={MoreScreen} />
      <MoreStack.Screen name="Collection" component={CollectionScreen} />
      <MoreStack.Screen name="Achievement" component={AchievementScreen} />
      <MoreStack.Screen name="Profile" component={ProfileScreen} />
    </MoreStack.Navigator>
  );
}

function MainApp() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#0D1B2A",
            borderTopColor: "#1A2744",
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 6,
          },
          tabBarActiveTintColor: "#F4C430",
          tabBarInactiveTintColor: "#4A5568",
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "600",
          },
        }}
      >
        <Tab.Screen
          name="Ana Ekran"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{"🏠"}</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Yatırım"
          component={InvestmentScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{"📈"}</Text>
            ),
          }}
        />
        <Tab.Screen
          name="İşletme"
          component={BusinessScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{"🏢"}</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Market"
          component={ShopScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{"🛒"}</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Sıralama"
          component={LeaderboardScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{"🏆"}</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Diğer"
          component={MoreStackScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>{"📋"}</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const onboardingDone = useGameStore((s) => s.onboardingDone);

  if (!onboardingDone) {
    return <OnboardingScreen />;
  }

  return <MainApp />;
}
