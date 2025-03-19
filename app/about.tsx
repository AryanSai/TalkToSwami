import { Text, View, StyleSheet, Image, ScrollView, ImageBackground } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ImageBackground source={require('../assets/images/floral.png')} style={styles.background}>
        <Image
          source={require('../assets/images/icon.png')} // Adjust the image path as needed
          style={styles.logo}
        />
        <Text style={styles.title}>Talk to Swami</Text>
        <Text style={styles.description}>
          The "Talk to Swami" application allows you to receive a divine message from Bhagawan Sri Sathya Sai Baba.
          When the button is clicked, a message appears on the screen, offering guidance that can be seen as Swami’s answer to the question in your heart.
          Contemplating this message provides clarity and insight into your query.{"\n\n"}
          The app draws inspiration from the "Chit Boxes" found in Swami's educational institutions, where students have long sought spiritual answers.
        </Text>
      </ImageBackground>
    </ScrollView>
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
});
