import 'dotenv/config';

export default {
    expo: {
      name : "allergy-tracker",
      slug: "allergy-tracker",
      version : "1.0.0",
      projectId: process.env.PROJECT_ID,
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
        infoPlist: {
          NSLocationWhenInUseUsageDescription: "We need your location to show you nearby allergens.",
          NSLocationAlwaysUsageDescription: "We need your location to track allergens in your area.",
          NSLocationAlwaysAndWhenInUseUsageDescription: "We need your location for accurate allergy tracking.",
          NSUserTrackingUsageDescription: "We use notifications to remind you to take your medication.",
          UIBackgroundModes: ["location", "fetch"]
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
        },      
        permissions: [
          "ACCESS_FINE_LOCATION",
          "ACCESS_COARSE_LOCATION",
          "RECEIVE_BOOT_COMPLETED",
          "VIBRATE",
          "NOTIFICATIONS"
        ]
      },
      web: {
        favicon: "./assets/favicon.png"
      },
      plugins: [
        "expo-font"
      ]
    },
  };