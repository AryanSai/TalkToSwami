import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Home' , headerShown: false}} />
      <Stack.Screen name="about" options={{ title: 'About', headerShown: false}} />
      {/* <Stack.Screen name="new" options={{ title: 'New', headerShown: false}} /> */}
    </Stack>
  );
}