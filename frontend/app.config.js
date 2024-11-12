import 'dotenv/config';

export default {
    expo: {
      name : "allergy-tracker",
      slug: "allergy-tracker",
      version : "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
      },
      ios: {
        config:{
            googleMapsApiKey: process.env.IOS_API_KEY, 
        },
        supportsTablet: true
      },
      android: {
        config:{
            googleMapsApiKey: process.env.ANDROID_API_KEY, 
        },
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#ffffff"
        }
      },
      web: {
        favicon: "./assets/favicon.png"
      },
      plugins: [
        "expo-font"
      ]
    },
  };