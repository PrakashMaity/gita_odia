# Expo Push & Update Guide (v2.0.0)

Since you have bumped the version from **1.0.3** to **2.0.0**, you should follow the **Full Store Update** path. Here is how to handle updates for your project.

---

## 1. Major Update: Full Store Release (v2.0.0)
Because this is a major version jump, you should create a new binary build to submit to the Play Store/App Store.

### Step 1: Run Production Build
Run the build command for your primary platform:

```bash
# For Android (Recommended for v2.0.0 jump)
eas build --platform android --profile production
```

### Step 2: Download & Submit
1. Once the build is finished, download the `.aab` file from the link provided by EAS.
2. Upload it to the **Google Play Console** under "Internal Testing" or "Production".

---

## 2. Fast Track: OTA (Over-The-Air) Updates
Use this for **small JS fixes** (UI tweaks, text changes) without requiring users to download a new app from the store.

### Command:
```bash
eas update --branch production --message "Fixed typography and added skeleton loading"
```
*Note: This only works within the same native version compatibility. Since you changed the version to 2.0.0, users on 1.0.3 will NOT receive these updates automatically if the "runtime version" has changed/migrated.*

---

## 3. Language-Specific Builds (APK)
If you just want to generate APKs for direct distribution (not for Play Store):

```bash
# Choose your target language
eas build --platform android --profile bn  # Bengali
eas build --platform android --profile or  # Odia
```

---

## 4. Pre-Push Checklist
- [ ] **Verify native changes**: Did you add any new native plugins (e.g., `expo-audio`)? If yes, a **New Build** is MANDATORY.
- [ ] **Test locally**: Run `npx expo start --no-dev --minify` to see how it performs in production mode.
- [ ] **Check Environment**: Ensure any secrets (Firebase, Supabase keys) are set in Expo Secrets if needed.

> [!TIP]
> Since you just implemented the **Skeleton Loading** and **Success Modal**, I highly recommend doing a **Full Store Build** (`eas build --platform android --profile production`) to ensure everyone gets the v2.0.0 experience.
