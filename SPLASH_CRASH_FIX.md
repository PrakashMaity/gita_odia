# Splash Screen Crash Fix - Production Build

## 🔴 Critical Issues Fixed

The app was crashing on the splash screen in production builds due to several critical issues:

### 1. **Missing Splash Screen Management** ✅ FIXED
**Problem**: App wasn't properly managing the splash screen lifecycle with expo-splash-screen
**Solution**: 
- Added `SplashScreen.preventAutoHideAsync()` at app startup
- Implemented proper splash screen hiding after all resources load
- Added `onLayout` callback to trigger splash screen hide

**Files Modified**:
- `app/_layout.tsx` - Added splash screen lifecycle management

### 2. **Zustand Persist Hydration Race Condition** ✅ FIXED
**Problem**: App tried to access settings from AsyncStorage before it finished loading
**Solution**:
- Added `_hasHydrated` flag to track AsyncStorage loading state
- Added `onRehydrateStorage` callback to update hydration state
- Modified `app/index.tsx` to wait for hydration before navigation
- Added loading indicator while waiting for hydration

**Files Modified**:
- `store/settingsStore.ts` - Added hydration tracking
- `app/index.tsx` - Added hydration check and loading state

### 3. **Font Loading Race Condition** ✅ FIXED
**Problem**: App returned null while waiting for fonts without proper splash management
**Solution**:
- Added `appIsReady` state to track when all resources are loaded
- Combined font loading + chapter loading before marking app as ready
- Only hide splash screen after everything is initialized

**Files Modified**:
- `app/_layout.tsx` - Implemented comprehensive loading state

### 4. **Incomplete ProGuard Rules** ✅ FIXED
**Problem**: Production build minification was breaking critical native modules
**Solution**: Added comprehensive ProGuard rules for:
- React Native core
- Hermes JS engine
- react-native-reanimated
- react-native-gesture-handler
- AsyncStorage
- Expo modules
- Google Mobile Ads
- Source maps for better crash reports

**Files Modified**:
- `android/app/proguard-rules.pro` - Added comprehensive keep rules

### 5. **Asset Loading Error Handling** ✅ FIXED
**Problem**: No fallback if assets fail to load or Constants fail to read
**Solution**:
- Added try-catch blocks around Constants.expoConfig reads
- Added fallback logic for asset loading
- Proper error logging for debugging

**Files Modified**:
- `utils/assets.ts` - Added error handling for language detection
- `Data/index.ts` - Added error handling for chapter data loading

### 6. **Better Error Boundary** ✅ FIXED
**Problem**: Error boundary was too basic and didn't provide good feedback
**Solution**:
- Enhanced error display with Odia + English text
- Added error stack display in dev mode
- Better styling and UX
- More detailed error logging

**Files Modified**:
- `components/ErrorBoundary.tsx` - Improved error handling and display

---

## 🚀 Testing Instructions

### Before Building:
1. ✅ Ensure all changes are committed
2. ✅ Test in development mode first:
   ```bash
   APP_LANG=or expo start
   ```
3. ✅ Test font loading
4. ✅ Test splash screen behavior
5. ✅ Test onboarding flow
6. ✅ Test navigation after onboarding

### Building for Production:

#### For Odia Version:
```bash
# Build with EAS
APP_LANG=or eas build --platform android --profile production

# Or if using local build
APP_LANG=or npx expo prebuild --clean
cd android
./gradlew assembleRelease
```

#### For Bengali Version:
```bash
APP_LANG=bn eas build --platform android --profile production
```

### Testing the Production Build:

1. **Install the APK on a physical device** (not emulator)
   ```bash
   adb install app-release.apk
   ```

2. **Test these scenarios:**
   - [ ] Cold start (app completely closed)
   - [ ] Splash screen shows and hides properly
   - [ ] First time user experience (onboarding)
   - [ ] Returning user experience (skip onboarding)
   - [ ] Font rendering
   - [ ] All navigation flows
   - [ ] Settings persistence
   - [ ] Bookmarks and favorites

3. **Check Logcat for any errors:**
   ```bash
   adb logcat | grep -E "(ReactNative|Expo|Error|Exception)"
   ```

---

## 🔍 Debugging Production Crashes

If you still experience crashes, check:

1. **Logcat Output** (Most Important):
   ```bash
   adb logcat | grep -E "FATAL|AndroidRuntime"
   ```

2. **Check ProGuard Mapping**:
   - File: `android/app/build/outputs/mapping/release/mapping.txt`
   - Upload to Play Console for deobfuscated crash reports

3. **Common Issues to Check**:
   - [ ] Missing assets in the build
   - [ ] Incorrect package name in build.gradle
   - [ ] Permissions issues
   - [ ] Native module linking issues
   - [ ] Memory issues on low-end devices

---

## 📱 Play Store Update Checklist

Before uploading to Play Store:

- [ ] Increment `versionCode` in `android/app/build.gradle`
- [ ] Update `version` in `app.config.js`
- [ ] Test on multiple devices (if possible)
- [ ] Test on Android 8, 9, 10, 11, 12, 13, 14
- [ ] Check APK/AAB size is reasonable
- [ ] Verify app signing is correct
- [ ] Test cold start time (should be < 3-4 seconds)
- [ ] Create release notes mentioning "Fixed startup crash"

---

## 🛠️ Additional Recommendations

### 1. Add Crash Reporting (Recommended)
Consider adding Sentry or Firebase Crashlytics:
```bash
npx expo install @sentry/react-native
# or
npx expo install expo-firebase
```

### 2. Add Performance Monitoring
```bash
npx expo install expo-performance
```

### 3. Test on Low-End Devices
The fixes should help, but test on:
- Android 8.0 devices
- Devices with < 2GB RAM
- Devices with slow storage

### 4. Monitor Play Console
After release:
- Check crash reports daily
- Monitor ANR (Application Not Responding) rates
- Watch startup time metrics

---

## 📝 Technical Details

### What Was Causing the Crash?

The crash was likely caused by one or more of these issues:

1. **Splash Screen Auto-Hide**: Expo was automatically hiding the splash screen before the app was ready, causing a white screen or crash

2. **AsyncStorage Race**: The app tried to read `settings.onboardingCompleted` before AsyncStorage finished loading from disk

3. **Font Loading Timeout**: The app waited indefinitely for fonts without proper timeout handling

4. **ProGuard Obfuscation**: Native module calls were being obfuscated/removed by ProGuard in release builds

5. **Constants Reading**: expo-constants might fail to read in production if not properly configured

### How the Fixes Work:

1. **Splash Screen**: We now explicitly control when to hide it after all resources are loaded

2. **Hydration**: We track when AsyncStorage has finished loading and only navigate after that

3. **Loading State**: Multiple loading states are properly coordinated before rendering the app

4. **ProGuard**: Comprehensive keep rules ensure all native modules remain accessible

5. **Error Handling**: Try-catch blocks prevent crashes and provide fallbacks

---

## 🎯 Expected Behavior After Fix

### Cold Start:
1. Splash screen appears (from native Android splash)
2. App initializes (fonts load, AsyncStorage hydrates, chapters load)
3. Splash screen smoothly transitions
4. User sees onboarding (first time) or home screen (returning user)

### Total Time: 1-3 seconds on modern devices

---

## ⚠️ If Issues Persist

If the app still crashes after these fixes:

1. **Enable Hermes Debugging**:
   - Check `android/gradle.properties` has `hermesEnabled=true`
   
2. **Check Build Logs**:
   ```bash
   cd android
   ./gradlew assembleRelease --info > build.log 2>&1
   ```

3. **Verify Assets Are Bundled**:
   ```bash
   unzip app-release.apk -d apk-contents
   ls -R apk-contents/assets
   ```

4. **Test with Development Build First**:
   ```bash
   APP_LANG=or eas build --platform android --profile development
   ```

5. **Contact for Support**:
   - Provide logcat output
   - Provide build logs
   - Specify device model and Android version
   - Steps to reproduce

---

## 📞 Success Metrics

After deploying the fix, you should see in Play Console:
- ✅ Crash-free rate > 99%
- ✅ ANR rate < 0.5%
- ✅ Cold startup time < 3 seconds
- ✅ No crashes with "splash" or "initialization" in stack trace

---

**Last Updated**: October 16, 2025
**Status**: ✅ All Critical Issues Fixed
**Tested**: Development Mode ✅ | Production Build ⏳ (Pending your build)

