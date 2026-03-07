# AdMob Mediation Setup Guide

Complete guide for configuring **AdMob Mediation** with **AppLovin**, **Unity Ads**, and **Meta Audience Network** bidding in the Gita app.

---

## Table of Contents

- [How Mediation Works](#how-mediation-works)
- [Prerequisites](#prerequisites)
- [Step 1: Create Network Accounts](#step-1-create-network-accounts)
- [Step 2: Configure Mediation in AdMob Dashboard](#step-2-configure-mediation-in-admob-dashboard)
- [Step 3: Add Bidding Networks](#step-3-add-bidding-networks)
- [Step 4: Configure AppLovin](#step-4-configure-applovin)
- [Step 5: Configure Unity Ads](#step-5-configure-unity-ads)
- [Step 6: Configure Meta Audience Network](#step-6-configure-meta-audience-network)
- [Step 7: Set eCPM Floors](#step-7-set-ecpm-floors)
- [Testing Mediation](#testing-mediation)
- [Revenue Optimization Tips](#revenue-optimization-tips)
- [Troubleshooting](#troubleshooting)

---

## How Mediation Works

AdMob Mediation lets multiple ad networks compete for each ad request. Instead of showing only Google ads, you allow AppLovin, Unity, Meta, and others to bid in real-time. The highest-paying ad wins.

```
User triggers ad request
        │
        ▼
┌─────────────────────┐
│   AdMob Mediation   │
│     (Orchestrator)   │
└─────────┬───────────┘
          │ Real-time auction
          ▼
┌─────┬───────┬──────┬──────┐
│Google│AppLovin│Unity │ Meta │
│ $2  │  $3   │ $1.5 │ $2.5 │
└─────┴───────┴──────┴──────┘
          │
          ▼ Highest bid wins
┌─────────────────────┐
│  AppLovin Ad Shown  │
│     (CPM: $3.00)    │
└─────────────────────┘
```

### Bidding vs Waterfall

| Feature | Bidding (Recommended) | Waterfall |
|---------|----------------------|-----------|
| How it works | Real-time auction | Fixed priority order |
| Revenue | **20–40% higher** | Lower, manual optimization |
| Setup effort | Simpler | Needs constant tuning |
| Fairness | All networks compete equally | Top network always gets first look |

**Always use bidding.** It maximizes revenue automatically.

---

## Prerequisites

Before starting, ensure you have:

- [ ] **AdMob account**: [admob.google.com](https://admob.google.com)
- [ ] **AppLovin account**: [dash.applovin.com](https://dash.applovin.com)
- [ ] **Unity Ads account**: [dashboard.unity3d.com](https://dashboard.unity3d.com)
- [ ] **Meta for Developers account**: [developers.facebook.com](https://developers.facebook.com)
- [ ] Your app registered in AdMob with app IDs
- [ ] Ad unit IDs for Interstitial, Rewarded, and App Open

---

## Step 1: Create Network Accounts

### AppLovin

1. Sign up at [dash.applovin.com](https://dash.applovin.com)
2. Go to **Account → Keys** and note your **SDK Key** and **Report Key**
3. Go to **MAX → Manage → Ad Units** → Create ad units for each format (Interstitial, Rewarded)
4. Note the **Ad Unit IDs**

### Unity Ads

1. Sign up at [dashboard.unity3d.com](https://dashboard.unity3d.com)
2. Create a new project
3. Go to **Monetization → Ad Units** → Create ad units for each format
4. Go to **Monetization → Setup → API Access** and note your **Game ID** and **API Key**
5. Note the **Placement IDs**

### Meta Audience Network

1. Sign up at [developers.facebook.com](https://developers.facebook.com)
2. Go to **Monetization Manager** → Create an App
3. Create **Placement IDs** for Interstitial, Rewarded
4. Note the **Property ID** and **Placement IDs**

---

## Step 2: Configure Mediation in AdMob Dashboard

1. Open [AdMob Dashboard](https://admob.google.com)
2. Navigate to **Mediation** → **Create Mediation Group**
3. Select the ad format:
   - **Interstitial**
   - Click **Continue**
4. Name the group (e.g., `Gita - Interstitial - Global`)
5. Select your **Ad Unit** → the Interstitial ad unit you created
6. Click **Add Ad Sources**

**Repeat this for each ad format:** Interstitial, Rewarded, App Open.

---

## Step 3: Add Bidding Networks

In each Mediation Group:

### Add a Bidding Source

1. Click **Add Ad Source** → **Ad Network - Bidding**
2. You'll see available networks
3. Add each network one by one (AppLovin, Unity, Meta)
4. For each, you'll need to provide the credentials from Step 1

---

## Step 4: Configure AppLovin

### In the AdMob Mediation Group:

1. Click **Add Ad Source** → **Ad Network - Bidding** → Select **AppLovin**
2. If first time: Click **Set up mapping** → Enter:
   - **SDK Key**: Your AppLovin SDK Key
   - **Zone ID**: Your AppLovin Ad Unit ID
3. For reporting:
   - **Report Key**: Your AppLovin Report Key
4. Click **Done**

### Link AppLovin for Bidding:

1. In the AdMob dashboard, go to **Mediation** → **Partner Networks**
2. Find **AppLovin** → Click **Link**
3. Enter your **AppLovin API Key**
4. Enable **auto data collection**

---

## Step 5: Configure Unity Ads

### In the AdMob Mediation Group:

1. Click **Add Ad Source** → **Ad Network - Bidding** → Select **Unity Ads**
2. If first time: Click **Set up mapping** → Enter:
   - **Game ID**: Your Unity Game ID (Android/iOS)
   - **Placement ID**: Your Unity Placement ID
3. For reporting:
   - **API Key**: Your Unity API Key
   - **Organization Core ID**: Found in Unity Dashboard → Settings
4. Click **Done**

### Link Unity for Bidding:

1. Go to **Mediation** → **Partner Networks**
2. Find **Unity Ads** → Click **Link**
3. Enter your **Unity API Key** and **Organization Core ID**
4. Enable auto data collection

---

## Step 6: Configure Meta Audience Network

### In the AdMob Mediation Group:

1. Click **Add Ad Source** → **Ad Network - Bidding** → Select **Meta Audience Network**
2. If first time: Click **Set up mapping** → Enter:
   - **Placement ID**: Your Meta Placement ID
3. For reporting:
   - **Property ID**: Your Meta Property ID
   - **App ID**: Your Meta App ID
   - **App Secret**: Found in Meta for Developers dashboard
4. Click **Done**

### Link Meta for Bidding:

1. Go to **Mediation** → **Partner Networks**
2. Find **Meta Audience Network** → Click **Link**
3. Enter credentials
4. Enable auto data collection

---

## Step 7: Set eCPM Floors

eCPM floors prevent low-paying ads from showing. Set them per region for better revenue.

### How to Set Floors:

1. In your Mediation Group, click **eCPM floor** settings
2. Set regional floors:

| Region | Interstitial Floor | Rewarded Floor | App Open Floor |
|--------|-------------------|----------------|----------------|
| 🇮🇳 India | $0.30 – $0.50 | $0.50 – $1.00 | $0.20 – $0.40 |
| 🇺🇸 USA | $4.00 – $6.00 | $6.00 – $10.00 | $3.00 – $5.00 |
| 🇬🇧 UK | $3.00 – $5.00 | $5.00 – $8.00 | $2.50 – $4.00 |
| 🌐 Rest of World | $0.10 – $0.20 | $0.20 – $0.50 | $0.10 – $0.20 |

> **Tip:** Start with lower floors and increase gradually. Too-high floors = no ads shown.

---

## Testing Mediation

### 1. Enable Test Mode

In development (`__DEV__`), the `AdsManager` automatically uses test ad unit IDs:

```typescript
// Automatically handled by AdsManager
// In __DEV__ mode:
//   Interstitial → TestIds.INTERSTITIAL
//   Rewarded → TestIds.REWARDED
//   App Open → TestIds.APP_OPEN
```

### 2. Verify Mediation Configuration

1. In AdMob Dashboard → **Mediation** → Your group
2. Check the **Status** column — all networks should show ✅
3. If any show ⚠️ or ❌, check credentials

### 3. Test on Real Device

```bash
# Build development client
eas build --profile development --platform android

# Install and check logs for:
# [AdsManager] Google Mobile Ads SDK initialized
# [AdsManager] Interstitial loaded
# [AdsManager] Rewarded loaded
# [AdsManager] App open loaded
```

### 4. Ad Inspector

Use the built-in **Ad Inspector** to verify mediation:

```typescript
import { MobileAds } from 'react-native-google-mobile-ads';

// Open Ad Inspector (for debugging only)
MobileAds().openAdInspector();
```

The Ad Inspector shows:
- Which networks are configured
- Which network served each ad
- Bid/waterfall details
- Error diagnostics

### 5. Test Each Network

To verify each network is working:
1. Temporarily disable other networks in the mediation group
2. Load an ad and check the Ad Inspector to see which network served it
3. Re-enable all networks

---

## Revenue Optimization Tips

### For the Gita App Specifically

#### 1. Rewarded Ads = Highest Revenue (5–10× more than banners)

Best reward use cases:

| Reward | Where |
|--------|-------|
| 🔓 Unlock commentary | Verse reader screen |
| 📖 Unlock Sanskrit meaning | Verse detail |
| 🚫 Remove ads for 30 min | Settings / Ad gate |
| 🎵 Unlock audio playback | Chapter audio |
| ⭐ Unlock premium themes | Settings |

#### 2. Interstitial Timing (Don't Annoy Users)

**Best pattern for a reading app:**

```
User opens chapter → Reads content → Clicks "Next Chapter" → 🎯 Interstitial here
                                                              (after every 3 chapters)
```

**Never show interstitials:**
- On app launch (use app open ad instead)
- In the middle of reading a verse
- While audio is playing
- More than once every 2 minutes

The `AdsManager` enforces:
- 120-second cooldown between interstitials
- Only after every 3 screen navigations

#### 3. App Open Ad Placement

Show only on:
- ❄️ Cold start (first app launch)
- 🔄 Return after 2+ minutes in background

The `AdsManager` handles this automatically via `AppState` listener.

#### 4. Revenue Comparison

| Setup | Estimated CPM |
|-------|--------------|
| AdMob only | $1.00 |
| AdMob + AppLovin | $2.00 – $3.00 |
| AdMob + AppLovin + Unity | $3.00 – $4.00 |
| AdMob + AppLovin + Unity + Meta | $4.00 – $6.00 |

With **5,000 daily active users**, expected monthly revenue:

| Tier | Revenue/Month |
|------|--------------|
| AdMob only | $30 – $60 |
| Full mediation (4 networks) | $120 – $350 |

#### 5. A/B Test Ad Frequency

Use AdMob's experiments to test:
- Showing interstitials every **2 vs 3 vs 5** sessions
- Different eCPM floors
- Rewarded ad button placement

---

## Troubleshooting

### Common Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| `Ad not loaded` in logs | Network issue or no fill | Wait for retry (auto-reloads after 30s) |
| Low fill rate | eCPM floor too high | Lower your floors |
| Mediation network shows ❌ | Wrong credentials | Re-enter SDK key / API key in AdMob |
| Ads not showing in dev | Using production IDs | `AdsManager` auto-uses `TestIds` in `__DEV__` |
| App crash on ad show | SDK not initialized | Ensure `AdsManager.initialize()` runs first |
| `No ad config` error | Missing `app.config.js` keys | Check `INTERSTITIAL_AD_UNIT_ID` etc. in env |

### Debugging Checklist

1. ✅ `react-native-google-mobile-ads` is in `package.json`
2. ✅ `app.config.js` has the plugin with `androidAppId` and `iosAppId`
3. ✅ Ad unit IDs are set in `.env.*` files or `app.config.js` defaults
4. ✅ `AdsManager.getInstance().initialize()` is called in root layout
5. ✅ Building with `eas build` (not Expo Go — ads don't work in Expo Go)
6. ✅ Test device configured (automatic in `__DEV__`)

### Getting Help

- [react-native-google-mobile-ads Docs](https://docs.page/invertase/react-native-google-mobile-ads)
- [AdMob Mediation Help](https://support.google.com/admob/answer/3124703)
- [AppLovin MAX Docs](https://dash.applovin.com/documentation/mediation/android/getting-started)
- [Unity Ads Docs](https://docs.unity.com/ads/en-us/manual/UnityAdsHome)
- [Meta Audience Network Docs](https://developers.facebook.com/docs/audience-network)

---

## Code Architecture Reference

```
src/
├── services/
│   ├── AdsManager.ts          ← Centralized ad manager (singleton)
│   ├── adFreeService.ts       ← Ad-free / Pro status checks
│   └── ads/
│       └── initializeAds.ts   ← Low-level SDK init (used by AdsManager)
├── hooks/
│   ├── useAds.ts              ← Unified hook for screens
│   ├── useAdStatus.ts         ← Debug/settings ad status
│   ├── useInterstitialAd.ts   ← Legacy hook (still works)
│   └── useRewardedInterstitialAd.ts
├── components/
│   ├── AdGate.tsx             ← Rewarded content gatekeeper
│   └── ads/
│       ├── config/config.ts   ← Ad unit ID resolution
│       ├── interstitialAd.ts  ← Low-level interstitial helpers
│       ├── rewardedAd.ts      ← Low-level rewarded helpers
│       ├── appOpenAd.ts       ← Low-level app open helpers
│       └── index.ts           ← Barrel exports
```

### Quick Usage

```typescript
// In your root _layout.tsx
import AdsManager from '@/services/AdsManager';

useEffect(() => {
  AdsManager.getInstance().initialize();
  // Show app open ad on cold start
  AdsManager.getInstance().showAppOpen();
}, []);

// In any screen
import { useAds } from '@/hooks/useAds';

const { showInterstitial, showRewarded, recordNavigation } = useAds();

// Record navigation for frequency counting
useEffect(() => { recordNavigation(); }, []);

// Show interstitial on "Next Chapter" press
const onNextChapter = async () => {
  await showInterstitial();
  navigateToNextChapter();
};

// Unlock content with rewarded ad
const onUnlockCommentary = () => {
  showRewarded(() => setCommentaryUnlocked(true));
};
```
