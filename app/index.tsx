import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Linking,
  Platform,
  Share,
  Modal,
  FlatList,
  BackHandler,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { DrawerLayout, GestureHandlerRootView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useTranslation from "./translation";
import { StatusBar } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

const languageQuotes = {
  english: require('../assets/english.json'),
  telugu: require('../assets/telugu.json'),
  hindi: require('../assets/hindi.json'),
  tamil: require('../assets/tamil.json'),
  nepali: require('../assets/nepali.json'),
  kannada: require('../assets/kannada.json'),
  russian: require('../assets/russian.json'),
  german: require('../assets/german.json'),
  italian: require('../assets/italian.json'),
};

const languageTranslationTags = {
  english: "English",
  telugu: "తెలుగు - Telugu",
  hindi: "हिन्दी - Hindi",
  tamil: "தமிழ் - Tamil",
  nepali: "नेपाली - Nepali",
  kannada: "ಕನ್ನಡ - Kannada",
  russian: "русский - Russian",
  german: "Deutsch - German",
  italian: "Italiano - Italian"
};

const { width } = Dimensions.get('window');

const APP_STORE_URL = 'https://apps.apple.com/app/idYOUR_APP_ID';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.gmail.aryanias3.talktoswamicopy&hl=en_IN';
const CHROME_URL = 'https://chromewebstore.google.com/detail/talk-to-swami/jjpebaigoamlglpipgcfhaedhckgjcmj?hl=en'

type Quote = {
  quote: string;
  image: any;
};

// encouragement: require('../assets/images/icon.png'),
const categoryImages = {
  angry: require('../assets/images/angry.jpeg'),
  disappointed: require('../assets/images/disappointed.jpeg'),
  encouragement: require('../assets/images/encouragement.png'),
  dont: require('../assets/images/dont.jpg'),
  assurance: require('../assets/images/assurance.png'),
  appreciation: require('../assets/images/appreciation.png'),
  quotes: require('../assets/images/quotes.png'),
  suggestions: require('../assets/images/suggestions.png'),
  prayers: require('../assets/images/prayer.jpg'),
  audio: require('../assets/images/quotes.png'),
};

const LanguageStorage = {
  currentLanguage: 'english',

  async getLanguage(): Promise<string> {
    try {
      const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
      return savedLanguage || this.currentLanguage;
    } catch (error) {
      console.error('Failed to load language from storage:', error);
      return this.currentLanguage;
    }
  },

  async setLanguage(language: string): Promise<void> {
    try {
      await AsyncStorage.setItem('selectedLanguage', language);
      this.currentLanguage = language;
    } catch (error) {
      console.error('Failed to save language to storage:', error);
    }
  },
};

const FontSizeStorage = {
  defaultSize: 20,

  async getFontSize(): Promise<number> {
    try {
      const savedSize = await AsyncStorage.getItem('selectedFontSize');
      return savedSize ? parseInt(savedSize, 10) : this.defaultSize;
    } catch (error) {
      console.error('Failed to load font size from storage:', error);
      return this.defaultSize;
    }
  },

  async setFontSize(size: number): Promise<void> {
    try {
      await AsyncStorage.setItem('selectedFontSize', size.toString());
    } catch (error) {
      console.error('Failed to save font size to storage:', error);
    }
  },
};

const App: React.FC = () => {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('english'); // Default language
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [fontSize, setFontSize] = useState(20); // Default to medium size
  const [isFontSizeModalVisible, setIsFontSizeModalVisible] = useState(false);
  const translatedText = useTranslation(selectedLanguage);

  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const cardVisible = useSharedValue(false);

  const drawerRef = useRef<DrawerLayout>(null);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  useEffect(() => {
    const loadSettings = async () => {
      const [savedLanguage, savedFontSize] = await Promise.all([
        LanguageStorage.getLanguage(),
        FontSizeStorage.getFontSize()
      ]);
      setSelectedLanguage(savedLanguage);
      setFontSize(savedFontSize);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isDrawerOpen) {
        drawerRef.current?.closeDrawer();
        return true;
      }

      if (cardVisible.value) {
        // Animate card away when back is pressed
        translateY.value = withTiming(200, { duration: 300 }, () => {
          runOnJS(setCurrentQuote)(null);
        });
        opacity.value = withTiming(0, { duration: 300 });
        cardVisible.value = false;
        return true;
      } else {
        // Show exit confirmation when no card is visible
        Alert.alert(
          translatedText.exitTitle || 'Exit App',
          translatedText.exitMessage || 'Do you want to exit the app?',
          [
            {
              text: translatedText.exitNo || 'No',
              style: 'cancel'
            },
            {
              text: translatedText.exitYes || 'Yes',
              onPress: () => BackHandler.exitApp()
            }
          ]
        );
        return true;
      }
    });

    return () => backHandler.remove();
  }, [isDrawerOpen, cardVisible.value, translatedText]);
  const getRandomQuote = (): Quote => {
    const quotes = languageQuotes[selectedLanguage as keyof typeof languageQuotes];
    const categories = Object.keys(quotes);
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    const selectedQuotes = quotes[selectedCategory as keyof typeof quotes] as string[];
    const quote = selectedQuotes[
      Math.floor(Math.random() * selectedQuotes.length)
    ];
    return {
      quote: quote,
      image: categoryImages[selectedCategory as keyof typeof categoryImages],
    };
  };

  const handleCardPop = () => {
    const quote = getRandomQuote();
    setCurrentQuote(quote);
    translateY.value = 200; // Start position
    opacity.value = 0;
    translateY.value = withSpring(0); // Animate to position
    opacity.value = withSpring(1);
    cardVisible.value = true; // Mark card as visible
  };
  const handleLanguageChange = async (language: string) => {
    if (cardVisible.value) {
      translateY.value = withTiming(200, { duration: 300 }, () => {
        runOnJS(setCurrentQuote)(null); // Reset the card
        runOnJS(setSelectedLanguage)(language); // Update UI
        runOnJS(LanguageStorage.setLanguage)(language); // ✅ Persist it!
        runOnJS(setIsLanguageModalVisible)(false); // Close modal
      });
      opacity.value = withTiming(0, { duration: 300 });
      cardVisible.value = false;
    } else {
      await LanguageStorage.setLanguage(language); // ✅ Persist
      setSelectedLanguage(language); // Update UI
      setIsLanguageModalVisible(false); // Close modal
    }
  };

  const handleFontSizeChange = async (size: number) => {
    setFontSize(size);
    await FontSizeStorage.setFontSize(size);
    setIsFontSizeModalVisible(false);
  };

  const shareQuote = async (viewRef: any) => {
    if (cardVisible.value) {
      try {
        const uri = await captureRef(viewRef, {
          format: 'png',
          quality: 1
        });
        await Sharing.shareAsync(uri);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('No card to share!')
    }
  };


  const FontSizeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isFontSizeModalVisible}
      onRequestClose={() => setIsFontSizeModalVisible(false)}
    >
      <TouchableOpacity
        style={styles.modalContainer}
        activeOpacity={1}
        onPress={() => setIsFontSizeModalVisible(false)}
      >
        <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
          <Text style={styles.modalTitle}>{translatedText.fontSize}</Text>
          <View style={styles.fontSizeModalButtons}>
            <TouchableOpacity
              style={[styles.fontSizeModalButton, fontSize === 16 && styles.selectedButton]}
              onPress={() => handleFontSizeChange(16)}
            >
              <Text style={[styles.fontSizeModalButtonText, { fontSize: 16 }]}>
                {translatedText.small}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fontSizeModalButton, fontSize === 20 && styles.selectedButton]}
              onPress={() => handleFontSizeChange(20)}
            >
              <Text style={[styles.fontSizeModalButtonText, { fontSize: 20 }]}>
                {translatedText.medium}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.fontSizeModalButton, fontSize === 24 && styles.selectedButton]}
              onPress={() => handleFontSizeChange(24)}
            >
              <Text style={[styles.fontSizeModalButtonText, { fontSize: 24 }]}>
                {translatedText.large}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setIsFontSizeModalVisible(false)}
          >
            <Text style={styles.modalCloseButtonText}>{translatedText.close}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const LanguageModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isLanguageModalVisible}
      onRequestClose={() => setIsLanguageModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{translatedText.selectLanguage}</Text>
          <FlatList
            data={Object.keys(languageTranslationTags)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.languageItem}
                onPress={() => handleLanguageChange(item)}
              >
                <Text style={styles.languageItemText}>
                  {languageTranslationTags[item as keyof typeof languageTranslationTags]}
                </Text>
                {selectedLanguage === item && (
                  <AntDesign name="checkcircleo" size={24} color="black" />
                )}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setIsLanguageModalVisible(false)}
          >
            <Text style={styles.modalCloseButtonText}>{translatedText.close}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderDrawerContent = () => (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={StyleSheet.absoluteFillObject}
        activeOpacity={1}
        onPress={() => drawerRef.current?.closeDrawer()}
      >
        <View pointerEvents="box-none" style={{ flex: 1 }}>
          <View style={styles.welcomeContainer}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.welcomeLogo}
            />
            <Text style={styles.welcomeText}>{translatedText.welcome}</Text>
          </View>
          <View style={styles.drawerContent}>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => setIsLanguageModalVisible(true)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="language-sharp" size={24} color="black" />
                <Text style={[styles.drawerItemText, { paddingLeft: 10 }]}>
                  {translatedText.selectLanguage} : {translatedText.lang}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => setIsFontSizeModalVisible(true)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="format-size" size={24} color="black" />
                <Text style={[styles.drawerItemText, { paddingLeft: 10 }]}>
                  {translatedText.fontSize}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={async () => {
                const message = `❤️ Download Talk to Swami, a mobile application to receive a divine message from Bhagawan Sri Sathya Sai Baba with a single tap. Inspired by the Chit Boxes in Swami's Institutions, this app brings Swami's guidance to your fingertips — anytime, anywhere. 💫
                
                🌍 Available in: English, తెలుగు, हिन्दी, தமிழ், नेपाली, ಕನ್ನಡ, русский, Deutsch, Italiano. Update now for a brand-new experience in your own language!

                🔗 Google Play Store: ${PLAY_STORE_URL}

                🖇️ Chrome Extension: ${CHROME_URL}

                📱 iOS version coming soon!

                ✨ Like the app? Let His message reach more hearts. Share the app with the world! 💖`;
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="share-variant-outline" size={24} color="black" />
                <Text style={[styles.drawerItemText, { paddingLeft: 10 }]}>{translatedText.share}</Text>
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
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="star-rate" size={24} color="black" />
                <Text style={[styles.drawerItemText, { paddingLeft: 10 }]}>{translatedText.rateUs}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => Linking.openURL('mailto:aryanias3@gmail.com')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Octicons name="code-review" size={24} color="black" />
                <Text style={[styles.drawerItemText, { paddingLeft: 10 }]}>{translatedText.writeToUs}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => router.push('/about')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="information-circle-outline" size={24} color="black" />
                <Text style={[styles.drawerItemText, { paddingLeft: 10 }]}>{translatedText.about}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.drawerFooter}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => drawerRef.current?.closeDrawer()}
            >
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.madeInTag}>{translatedText.madeInIndia}</Text>
      </TouchableOpacity>
      <LanguageModal />
      <FontSizeModal />
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        backgroundColor="#000" // For Android
        barStyle="light-content"   // For iOS: 'light-content' or 'dark-content'
        translucent={false}        // Optional: true if you want it overlapping content
      />
      <DrawerLayout
        ref={drawerRef}
        drawerWidth={width}
        drawerPosition="left"
        drawerType="front"
        overlayColor="rgba(0, 0, 0, 0.1)"
        renderNavigationView={renderDrawerContent}
        onDrawerOpen={() => setIsDrawerOpen(true)}
        onDrawerClose={() => setIsDrawerOpen(false)}
        enableTrackpadTwoFingerGesture
      >
        <ImageBackground source={require('../assets/images/new.png')} style={styles.background}>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => drawerRef.current?.openDrawer()}
          >
            <MaterialIcons name="menu-open" size={24} color="black" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/icon.png')}
              style={styles.logo}
            />
            <Text style={styles.logoText}>Talk to Swami</Text>
          </View>
          <TouchableOpacity
            style={styles.screenshotButton}
            onPress={() => shareQuote(drawerRef.current)}
          >
            <MaterialCommunityIcons name="share-outline" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.container}>
            <Animated.View style={[styles.card, animatedStyle]}>
              {currentQuote && (
                <>
                  <Image source={currentQuote.image} style={styles.image} />
                  <View style={styles.textcontainer}>
                    <Text style={[styles.quote, { fontSize: fontSize }]}>{currentQuote.quote}</Text>
                  </View>
                </>
              )}
            </Animated.View>
            <TouchableOpacity
              style={styles.box}
              activeOpacity={0.7}
              onPress={handleCardPop}
            >
              <Text style={styles.button}>{translatedText.talktoswami}</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </DrawerLayout>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  drawerFooter: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(255, 255, 248)',
  },
  closeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContainer: {
    backgroundColor: 'rgb(255, 255, 248)',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  welcomeLogo: {
    alignItems: 'center',
    width: 80,
    height: 80,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  background: {
    flex: 1,
    backgroundColor: '#e5e5e5',
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
    height: '67%',
    backgroundColor: 'rgb(255, 255, 248)',
    borderRadius: 20,
    alignItems: 'center',
    position: 'absolute',
    flexDirection: 'column',
    bottom: '20%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    width: '100%',
    height: '70%',
  },
  textcontainer: {
    flex: 1,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  quote: {
    textAlign: 'center',
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  box: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: '5%',
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
  },
  madeInTag: {
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: '#fff',
    paddingBottom: 15,
  },
  button: {
    color: 'rgb(255, 255, 248)',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
  },
  menuButton: {
    position: 'absolute',
    top: '2%',
    left: '5%',
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
  logoContainer: {
    position: 'absolute',
    top: '1%',
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
    color: 'black',
  },
  screenshotButton: {
    right: '5%',
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
  menuButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerContent: {
    flex: 1,
    backgroundColor: 'rgb(255, 255, 248)',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  languageItemText: {
    fontSize: 18,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  fontSizeModalButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 20,
  },
  fontSizeModalButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
    marginVertical: 5,
  },
  selectedButton: {
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#000',
  },
  fontSizeModalButtonText: {
    fontWeight: 'bold',
  },
});

export default App;