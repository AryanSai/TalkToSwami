import React, { useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';

const rotations = ['2.5deg', '-3.2deg', '1.8deg', '-2.7deg', '4.1deg', '-1.5deg', '3.6deg'];

const CardStack = () => {
  const [topCard, setTopCard] = useState(0); // Active top card
  const [nextCard, setNextCard] = useState(1); // Card replacing the top card
  const translateYTop = useRef(new Animated.Value(0)).current;
  const translateYNext = useRef(new Animated.Value(150)).current; // Starts below the stack

  const handleCardSwap = () => {
    Animated.parallel([
      Animated.timing(translateYTop, {
        toValue: 150, // Move top card back
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYNext, {
        toValue: 0, // Move next card up
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Swap cards after animation
      setTopCard(nextCard);
      setNextCard((prev) => (prev + 1) % rotations.length);

      // Reset animations
      translateYTop.setValue(0);
      translateYNext.setValue(150);
    });
  };

  return (
    <View style={styles.container}>
      {/* Swapping Cards */}
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateY: translateYNext }, { rotate: rotations[nextCard] }], zIndex: 10 },
        ]}
      >
        <Text style={styles.text}>Card {nextCard + 1}</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateY: translateYTop }, { rotate: rotations[topCard] }], zIndex: 20 },
        ]}
      >
        <Text style={styles.text}>Card {topCard + 1}</Text>
      </Animated.View>

      <TouchableOpacity style={styles.button} onPress={handleCardSwap}>
        <Text style={styles.buttonText}>Swap Card</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 250,
    height: 150,
    backgroundColor: '#ccc',
    borderRadius: 15,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    position:'absolute',
    top:0,
    marginTop: 0,
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CardStack;
