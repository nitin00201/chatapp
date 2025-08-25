import { Stack } from "expo-router";
import { useUserStore } from "../store/useUserStore"; // adjust path if needed

export default function RootLayout() {
  const user = useUserStore((state) => state.user);
  const isLoggedIn = !!user;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="login" />
      )}

      {/* Always allow access to register */}
      <Stack.Screen name="register" />

      {/* Dynamic chat screen (app/chat/[id].tsx) */}
      <Stack.Screen
        name="chat/[id]"
        options={{
          headerShown: true,
          title: "Chat", // will be overridden in [id].tsx if you set it there
        }}
      />
    </Stack>
  );
}
