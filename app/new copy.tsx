import React, { useState, useRef } from 'react';
import { View, Text, Animated, PanResponder, TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';

const quotes = [
    "Believe in yourself!",
    "Stay positive and happy.",
    "Every moment is a fresh beginning.",
    "Change the world by being yourself."
];

const getRandomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];
const getRandomRotation = () => `${Math.random() * 2.5 - 1}deg`; // Between -10 and 10 degrees
const rotations = ['2deg','-2.5deg','1']


const Card = ({ text, animatedStyle, style }: { text?: any, animatedStyle?: any, style: StyleProp<ViewStyle> }) => (
    <Animated.View style={[styles.card, animatedStyle, style]}>
        <Text style={styles.cardText}>{text}</Text>
    </Animated.View>
);

const CardStack = () => {
    const [cardA, setCardA] = useState(getRandomQuote());
    const [cardB, setCardB] = useState(getRandomQuote());
    const position = useRef(new Animated.Value(0)).current;
    const [activeCard, setActiveCard] = useState('A');



    const handleNextCard = () => {
        Animated.timing(position, {
            toValue: 0, // Reset position
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            if (activeCard === 'A') {
                setCardB(getRandomQuote());
                setActiveCard('B');
            } else {
                setCardA(getRandomQuote());
                setActiveCard('A');
            }
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.stack}>
                {Array.from({ length: 7 }).map((_, i) => {
                    let width = 300 + 25 * i
                    return (
                        <Card 
                        key={i}
                        style={{
                            bottom: -400 - 12 * i,
                            transform: [{ rotate: getRandomRotation() }], // Random rotation
                            // transform:[{translateX:-10 + 5*i}],
                            zIndex: i, width: width
                        }} />)
                })}



                {/* <Card style={{bottom: -430, width: 375,
            // transform:[{translateX:15}],
             zIndex: 5}} text={cardA} animatedStyle={activeCard === 'A' ? { transform: [{ translateY: position }] } : {}} />
        <Card style={{bottom: -440, width: 400,
        // transform:[{translateX:20}],
         zIndex: 6}} animatedStyle={activeCard === 'B' ? { transform: [{ translateY: position }] } : {}} /> */}
                {/* {Array.from({length:2}).map((_,i) => (
        <Card style={{bottom: -450-20*i, width: 425 + 25*i, 
            // transform:[{translateX:25 + 5*i}],
             zIndex: 7+i}} />
        ))} */}
            </View>

            <TouchableOpacity onPress={handleNextCard} style={styles.button}>
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
    stack: { position: 'absolute', bottom: 100, alignItems: 'center' },
    card: { position: 'absolute', width: 400, height: 450, backgroundColor: 'white', borderRadius: 10, padding: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.9, shadowRadius: 2, elevation: 10 },
    cardText: { fontSize: 18, textAlign: 'center' },
    swipeZone: { position: 'absolute', bottom: 50, width: '100%', height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightgray' },
    button: { position: 'absolute', bottom: 20, backgroundColor: '#007bff', padding: 10, borderRadius: 5 },
    buttonText: { color: 'white', fontSize: 16 }
});

export default CardStack;
