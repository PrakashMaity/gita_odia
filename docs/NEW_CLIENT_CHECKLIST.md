# ✅ New Client Checklist

Use this checklist when adding a new language client. Replace `<lang>` with your language code (e.g., `hi`, `en`, `or`, `as`).

---

## Pre-requisites

- [ ] Language code decided: `__________`
- [ ] App name in target language: `__________`
- [ ] Android package ID: `com.proninja.__________`
- [ ] iOS bundle ID: `com.proninja.__________`
- [ ] 18 chapter JSON data files ready
- [ ] UI translation strings ready

---

## Third-Party Accounts

- [ ] **AdMob** — New app created, ad unit IDs obtained
  - [ ] Android App ID
  - [ ] iOS App ID
  - [ ] Banner Ad Unit ID
  - [ ] Interstitial Ad Unit ID
  - [ ] Rewarded Ad Unit ID
  - [ ] Rewarded Interstitial Ad Unit ID
- [ ] **Supabase** — Project created (or reusing existing)
  - [ ] URL
  - [ ] Anon Key
- [ ] **RevenueCat** — Project created, API keys obtained
  - [ ] Android API Key
  - [ ] iOS API Key
- [ ] **EAS** — Project initialized (`eas init`)
  - [ ] Project ID
- [ ] **Firebase** — Project created (if separate)
  - [ ] `google-services.json` downloaded

---

## Code Changes

### Environment Files
- [ ] `.env.<lang>.development` created with all keys
- [ ] `.env.<lang>.production` created with all keys

### Branding Assets
- [ ] `assets/images/<lang>/icon.png` (1024x1024)
- [ ] `assets/images/<lang>/adaptive-icon.png` (1024x1024)
- [ ] `assets/images/<lang>/splash-icon.png` (1024x1024)
- [ ] `assets/images/<lang>/logo.png`
- [ ] `assets/images/<lang>/favicon.png` (48x48)

### Chapter Data
- [ ] `assets/Data/<lang>/` folder created
- [ ] `chapter1.json` through `chapter18.json` added
- [ ] All chapter JSONs follow the correct schema
- [ ] `id` fields match Bengali chapter/verse IDs
- [ ] Verse numbers in target language script

### Data Resolver
- [ ] `assets/Data/index.ts` — chapter imports added
- [ ] `assets/Data/index.ts` — language added to `chaptersByLang` map

### UI Translations
- [ ] `src/lib/i18n/translations/<lang>.json` created
- [ ] All keys from `bn.json` translated
- [ ] `src/lib/i18n/index.ts` — import and register new translation

### Client Config
- [ ] `src/config/clientConfig.ts` — new entry in `CLIENTS` map
  - [ ] `lang` set
  - [ ] `appName` set
  - [ ] `fontFamily` set (add font file if new script)
  - [ ] `scriptDirection` set

### Build Config
- [ ] `eas.json` — new build profile added
- [ ] `package.json` — convenience scripts added (optional)

### Fonts (if new script)
- [ ] `.ttf` font file added to `assets/fonts/`
- [ ] Font registered in app config

---

## Testing

- [ ] `npm run start:<lang>` — app launches without errors
- [ ] App name displays correctly in target language
- [ ] All 18 chapters load on Chapters screen
- [ ] Verse text displays correctly (right script/font)
- [ ] UI translations appear throughout the app
- [ ] Search works with target language text
- [ ] Bookmarks and favorites work
- [ ] Share feature generates correct language text
- [ ] Subscription flow works
- [ ] Ads load correctly (development IDs)

---

## Production Build

- [ ] `.env.<lang>.production` has production keys
- [ ] `eas build --profile <lang> --platform android` succeeds
- [ ] APK size is ~same as Bengali APK (~625 KB data)
- [ ] Production ads load correctly
- [ ] RevenueCat purchases work
- [ ] Firebase analytics tracking works

---

## Play Store / App Store

- [ ] New app listing created
- [ ] App title and description in target language
- [ ] Screenshots in target language
- [ ] APK/AAB uploaded
- [ ] Privacy policy updated (if needed)
