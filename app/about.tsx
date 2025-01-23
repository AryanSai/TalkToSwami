import { Text, View, StyleSheet, Image, ScrollView } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/icon.png')} // Adjust the image path as needed
          style={styles.logo}
        />
        <Text style={styles.title}>About Talk to Swami</Text>
        <Text style={styles.description}>
          The "Talk to Swami" application allows users to receive a divine message from Bhagawan Sri Sathya Sai Baba.
          When the button is clicked, a message appears on the screen, offering guidance that can be seen as Swami’s answer to the question in your heart.
          Contemplating this message provides clarity and insight into your query.{"\n\n"}
          The app draws inspiration from the "Chit Boxes" found in Swami's educational institutions, where devotees have long sought spiritual answers.
        </Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
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
