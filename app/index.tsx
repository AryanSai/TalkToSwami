import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Linking, Platform,
  Share,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { DrawerLayout, GestureHandlerRootView } from 'react-native-gesture-handler';
import quotesData from '../assets/english.json';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_ID'; // Replace YOUR_APP_ID with your app's ID
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.gmail.aryanias3.talktoswamicopy&hl=en_IN'; // Replace YOUR_PACKAGE_NAME with your app's package name

type Quote = {
  quote: string;
  image: any;
};

const categoryImages = {
  angry: require('../assets/images/icon.png'),
  disappointed: require('../assets/images/icon.png'),
  encouragement: require('../assets/images/icon.png'),
  dont: require('../assets/images/icon.png'),
  assurance: require('../assets/images/icon.png'),
  appreciation: require('../assets/images/icon.png'),
  quotes: require('../assets/images/icon.png'),
  suggestions: require('../assets/images/icon.png'),
  prayers: require('../assets/images/icon.png'),
  audio: require('../assets/images/icon.png'),
};


const App: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  const drawerRef = useRef<DrawerLayout>(null);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getRandomQuote = (): Quote => {
    const categories = Object.keys(quotesData);
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    const selectedCategoryQuotes = quotesData[selectedCategory as keyof typeof quotesData] as string[];

    const randomQuoteText = selectedCategoryQuotes[
      Math.floor(Math.random() * selectedCategoryQuotes.length)
    ];
    return {
      quote: randomQuoteText,
      image: categoryImages[selectedCategory as keyof typeof categoryImages],
    };
  };

  const handleCardPop = () => {
    const randomQuote = getRandomQuote();
    setCurrentQuote(randomQuote);

    translateY.value = 200; // Start position
    opacity.value = 0;

    translateY.value = withSpring(0); // Animate to position
    opacity.value = withSpring(1);
  };

  const renderDrawerContent = () => (
    <View style={{ flex: 1 }}>
      {/* Overlay to Close Drawer */}
      <TouchableOpacity
        style={StyleSheet.absoluteFillObject}
        activeOpacity={1} // Prevent visual feedback
        onPress={() => drawerRef.current?.closeDrawer()}
      >
        <View pointerEvents="box-none" style={{ flex: 1 }}>
          <View style={styles.drawerContent}>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => alert('Select Language: ')}
            >
              <View style={{ flexDirection: 'row' }}>
                <FontAwesome name="globe" size={24} color="black" />
                <Text style={[styles.drawerItemText, { paddingLeft: 10 }]}>Language</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={async () => {
                const message = `Check out this amazing app!\n\nDownload it here:\n${APP_STORE_URL} and ${PLAY_STORE_URL}`;
                try {
                  const result = await Share.share({
                    message,
                  });
                  if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                      console.log('Shared with activity type:', result.activityType);
                    } else {
                      console.log('Shared successfully!');
                    }
                  } else if (result.action === Share.dismissedAction) {
                    console.log('Share dismissed');
                  }
                } catch (error) {
                  console.error('Error while sharing:', error);
                }
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <FontAwesome name="share-alt" size={24} color="black" />
                <Text style={[styles.drawerItemText, { paddingLeft: 10 }]}>Share</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                const storeUrl = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
                Linking.openURL(storeUrl).catch(err =>
                  console.error('Failed to open store URL:', err)
                );
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <FontAwesome name="star" size={24} color="black" />
                <Text style={[styles.drawerItemText, { paddingLeft: 10 }]}>Rate us</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => Linking.openURL('mailto:aryanias3@gmail.com')}
            >
              <View style={{ flexDirection: 'row' }}>
                <FontAwesome name="envelope" size={24} color="black" />
                <Text style={[styles.drawerItemText, { paddingLeft: 10 }]}>Write to us</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => router.push('/about')}
            >
              <View style={{ flexDirection: 'row' }}>
                <FontAwesome name="info-circle" size={24} color="black" />
                <Text style={[styles.drawerItemText, { paddingLeft: 10 }]}>About</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.madeInTag}> Made with ❤️ in India 🇮🇳 </Text>
      </TouchableOpacity>

    </View>
  );


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <DrawerLayout
          ref={drawerRef}
          drawerWidth={width} //set drawer width to full screen width
          drawerPosition="left"
          drawerType="front" // use 'front' to make it cover the screen
          overlayColor="rgba(0, 0, 0, 0.4)" // semitransparent overlay
          renderNavigationView={renderDrawerContent}
          onDrawerOpen={() => setIsDrawerOpen(true)}
          onDrawerClose={() => setIsDrawerOpen(false)}
        >
      <ImageBackground source={require('../assets/images/main_bg.jpg')} style={styles.background}>
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => drawerRef.current?.openDrawer()}
            >
              <Text style={styles.menuButtonText}>☰</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logo}>
              <Image
                source={require('../assets/images/icon.png')}
                style={{ width: '100%', height: '100%' }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.screenshotButton}
              onPress={() => alert('Screenshot')}
            >
              <Text style={styles.menuButtonText}>📷</Text>
            </TouchableOpacity>
            <View style={styles.container}>
              <Animated.View style={[styles.card, animatedStyle]}>
                {currentQuote && (
                  <>
                    <Image source={currentQuote.image} style={styles.image} />
                    <Text style={styles.quote}>{currentQuote.quote}</Text>
                  </>
                )}
              </Animated.View>
              <TouchableOpacity style={styles.box} activeOpacity={0.7} onPress={handleCardPop}>
                <Text style={styles.boxText}>Talk to Swami</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </DrawerLayout>
    </GestureHandlerRootView >
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#fff7f7',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    height: '70%',
    padding: 20,
    backgroundColor: '#fff7f7',
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: '20%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '60%',
    resizeMode: 'cover',
  },
  quote: {
    textAlign: 'center',
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: '20%',
    left: '10%',
    right: '10%',
    paddingLeft: 10,
    paddingRight: 10,
  },
  box: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '5%',
    borderRadius: 10,
    marginBottom: 20,
  },
  madeInTag: {
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#fff',
    paddingBottom: 15,
  },
  boxText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    padding: 15,
  },
  menuButton: {
    position: 'absolute',
    top: '2%',
    left: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  logo: {
    position: 'absolute',
    top: '2%',
    borderRadius: 5,
    zIndex: 10,
    width: 50, // Replace with your desired width
    height: 50, // Replace with your desired height
  },
  screenshotButton: {
    position: 'absolute',
    top: '2%',
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    zIndex: 10,
  },
  menuButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  drawerContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  drawerItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  drawerItemText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;