# Gita Odia (ଗୀତା ଓଡ଼ିଆ) 📱

A multilingual Bhagavad Gita app built with React Native and Expo, supporting Odia, Bengali, Hindi, and Assamese.

## 🔴 Critical Fix - Version 1.0.2 (October 2025)

**Issue**: App was crashing on splash screen after downloading from Play Store  
**Status**: ✅ **FIXED**

### What was fixed:
- ✅ Splash screen lifecycle management
- ✅ AsyncStorage hydration race condition
- ✅ Font loading coordination
- ✅ ProGuard rules for production builds
- ✅ Error handling improvements

### For detailed information:
- **Fix Documentation**: See [SPLASH_CRASH_FIX.md](./SPLASH_CRASH_FIX.md)
- **Quick Commands**: See [QUICK_COMMANDS.md](./QUICK_COMMANDS.md)
- **Changes Summary**: See [CHANGES_SUMMARY.md](./CHANGES_SUMMARY.md)

---

This is an [Expo](https://expo.dev) project with multi-language support.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app for specific language

   ```bash
   # For Odia (default)
   npm run start:or
   
   # For Bengali
   npm run start:bn
   
   # For Hindi
   npm run start:hi
   
   # For Assamese
   npm run start:as
   ```

3. Build for production

   ```bash
   # Using build script (recommended)
   ./build-production.sh or
   
   # Or using EAS directly
   APP_LANG=or eas build --platform android --profile or
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Multi-Language Support

The app supports 4 languages, each with its own assets and data:

- **bn**: Bengali (বাংলা) - `clients/bn/`
- **or**: Odia (ଓଡ଼ିଆ) - `clients/or/`
- **hi**: Hindi (हिंदी) - `clients/hi/`
- **as**: Assamese (অসমীয়া) - `clients/as/`

Each language has its own:
- Fonts (`assets/fonts/`)
- Images (`assets/images/`)
- Chapter data (`data/`)
- Theme configuration (`theme/`)

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
# gita


# Bengali
 APP_LANG=bn eas build --platform android --profile bn
 # Odia
 APP_LANG=or eas build --platform android --profile or
# English
 APP_LANG=en eas build --platform android --profile en
# Hindi
 APP_LANG=hi eas build --platform android --profile hi
# Assamese
 APP_LANG=as eas build --platform android --profile as
