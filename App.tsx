import React, { useState, useEffect } from "react";
import { Text, View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useGameStore } from "./src/store/useGameStore";
import { supabase } from "./src/lib/supabase";
import { cloudLoad } from "./src/hooks/useSupabase";
import AuthScreen from "./src/screens/AuthScreen";
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
import QuestScreen from "./src/screens/QuestScreen";
import WheelScreen from "./src/screens/WheelScreen";
import ManagerScreen from "./src/screens/ManagerScreen";

const Tab = createBottomTabNavigator();
const MoreStack = createNativeStackNavigator();

function MoreStackScreen() {
  return (
    <MoreStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#0D1B2A" },
        headerTintColor: "#F4C430",
        headerTitleStyle: { color: "#E2E8F0", fontWeight: "bold", fontSize: 17 },
        headerShadowVisible: false,
      }}
    >
      <MoreStack.Screen name="MoreHub" component={MoreScreen} options={{ headerShown: false }} />
      <MoreStack.Screen name="Quest" component={QuestScreen} options={{ title: "Görevler" }} />
      <MoreStack.Screen name="Wheel" component={WheelScreen} options={{ title: "Şans Çarkı" }} />
      <MoreStack.Screen name="Manager" component={ManagerScreen} options={{ title: "Yöneticiler" }} />
      <MoreStack.Screen name="Collection" component={CollectionScreen} options={{ title: "Koleksiyon" }} />
      <MoreStack.Screen name="Achievement" component={AchievementScreen} options={{ title: "Başarımlar" }} />
      <MoreStack.Screen name="Profile" component={ProfileScreen} options={{ title: "Profil" }} />
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

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingLogo}>{"🏦"}</Text>
      <Text style={styles.loadingTitle}>TapEmpire</Text>
      <ActivityIndicator size="large" color="#F4C430" style={{ marginTop: 20 }} />
      <Text style={styles.loadingText}>Yükleniyor...</Text>
    </View>
  );
}

export default function App() {
  const [authState, setAuthState] = useState<"loading" | "auth" | "ready">("loading");
  const onboardingDone = useGameStore((s) => s.onboardingDone);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session?.user) {
          await cloudLoad();
          setAuthState("ready");
        } else {
          setAuthState("auth");
        }
      } catch {
        setAuthState("auth");
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setAuthState("auth");
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleAuth = async (userId: string) => {
    setAuthState("loading");
    const loaded = await cloudLoad();
    if (!loaded) {
      const { data } = await supabase.auth.getSession();
      const meta = data?.session?.user?.user_metadata;
      if (meta?.username) {
        useGameStore.getState().setPlayerInfo(meta.username, "");
      }
    }
    setAuthState("ready");
  };

  if (authState === "loading") {
    return <LoadingScreen />;
  }

  if (authState === "auth") {
    return <AuthScreen onAuth={handleAuth} />;
  }

  if (!onboardingDone) {
    return <OnboardingScreen />;
  }

  return <MainApp />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#070D1A",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingLogo: { fontSize: 64, marginBottom: 8 },
  loadingTitle: {
    color: "#F4C430",
    fontSize: 32,
    fontWeight: "900",
  },
  loadingText: {
    color: "#A0AEC0",
    fontSize: 14,
    marginTop: 12,
  },
});
