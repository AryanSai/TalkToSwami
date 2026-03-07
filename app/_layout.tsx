import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}