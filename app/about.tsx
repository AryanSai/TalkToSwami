import React from 'react';
import { Text, StyleSheet, Image, ScrollView, ImageBackground, Linking, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

const GITHUB_URL = 'https://github.com/AryanSai/TalkToSwami';
const CHROME_URL = 'https://chromewebstore.google.com/detail/talk-to-swami/jjpebaigoamlglpipgcfhaedhckgjcmj?hl=en'
const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_ID';


export default function AboutScreen() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          headerShown: false,
        }}
      />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ImageBackground source={require('../assets/images/floral.png')} style={styles.background}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <AntDesign name="back" size={24} color="black" />
          </TouchableOpacity>
          <Image
            source={require('../assets/images/icon.png')} // Adjust the image path as needed
            style={styles.logo}
          />
          <Text style={styles.title}>Talk to Swami</Text>
          <Text style={styles.description}>
            The "Talk to Swami" application allows you to receive a divine message from Bhagawan Sri Sathya Sai Baba.

            {"\n\n"}

            When the button is clicked, a message appears on the screen that can be seen as Swami's answer to the question in your heart. Contemplating this message provides clarity and insight into your query.{"\n\n"}
            The app draws inspiration from the "Chit Boxes" found in Swami's educational institutions, where students have long sought answers.
            {"\n\n"}

            It is also available as a Chrome Extension:{" "}
            <TouchableOpacity onPress={() => Linking.openURL(CHROME_URL)}>
              <Text style={styles.link}>Download from Chrome Web Store</Text>
            </TouchableOpacity>

            {"\n\n"}

            The Talk to Swami app is open source!{" "}
            <TouchableOpacity onPress={() => Linking.openURL(GITHUB_URL)}>
              <Text style={styles.link}>View on GitHub</Text>
            </TouchableOpacity>
            {"\n\n"}
            We warmly welcome contributions from the community. Every contribution helps spread Swami's message to more hearts.
          </Text>
        </ImageBackground>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
  backButton: {
    left: '5%',
    position: 'absolute',
    top: '2%',
    backgroundColor: 'rgb(255, 255, 248)',
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
});
