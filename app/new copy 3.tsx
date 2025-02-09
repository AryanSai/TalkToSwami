import React, { useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';

const rotations = ['2.5deg', '-3.2deg', '1.8deg', '-2.7deg', '4.1deg', '-1.5deg', '3.6deg'];



const CardStack = () => {
  const [stack, setStack] = useState([0, 1, 2, 3]); // Stack of card indexes
  const translateY = useRef(new Animated.Value(0)).current;
  const [isCardOnTop, setIsCardOnTop] = useState(false);
  const [topCard, setTopCard] = useState(0); // Active top card
  const [nextCard, setNextCard] = useState(1); // Card replacing the top card
  const translateYTop = useRef(new Animated.Value(100)).current;
  const translateYNext = useRef(new Animated.Value(200)).current; // Starts below the stack
  
  const handleCardSwap = () => {
    Animated.parallel([
      Animated.timing(translateYTop, {
        toValue: 200, // Move top card back
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(translateYNext, {
        toValue: 100, // Move next card up
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Swap cards after animation
      setTopCard(nextCard);
      setNextCard((prev) => (prev + 1) % rotations.length);

      // Reset animations
      translateYTop.setValue(100);
      translateYNext.setValue(200);
    });
  };

  return (
    <View style={styles.container}>
      {stack.map((cardIndex, i) => {
        const isTopCard = i === stack.length - 1;
        return (
          <Animated.View
            key={cardIndex}
            style={[
              styles.card,
              {
                transform: [
                  { translateY: isTopCard ? translateY : 0 },
                  { rotate: rotations[i] },
                ],
                zIndex: isTopCard ? 10 : i, // Ensure the top card is in front
                bottom: -20 * i,
              },
            ]}
          >
            <Text style={styles.text}>Card {cardIndex + 1}</Text>
          </Animated.View>
        );
      })}

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
        <Text style={styles.buttonText}>
          {isCardOnTop ? 'Next Card' : 'Pull Up'}
        </Text>
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
