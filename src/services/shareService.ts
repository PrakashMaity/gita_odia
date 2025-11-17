import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { storeShareAnalytics } from './shareAnalyticsService';

export interface ShareData {
  verseId: string;
  chapterId: string;
  chapterNumber: string;
  verseNumber: string;
  verseText?: string; // Optional for translation-only shares
  translation: string;
  speaker: string;
  timestamp: number;
  isTranslationOnly?: boolean; // Flag to indicate if this is translation-only share
}

const SHARE_DATA_KEY = 'gita_share_data';
const MAX_STORED_SHARES = 100; // Limit stored shares to prevent storage bloat

// Play Store download link
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.proninja.bhagavad_gita';
const APP_STORE_URL = 'https://apps.apple.com/app/id[APP_ID]'; // Update with actual App Store ID when available

/**
 * Get Play Store download URL
 */
export function getPlayStoreUrl(): string {
  return PLAY_STORE_URL;
}

/**
 * Get formatted download link text
 */
export function getDownloadLinkText(): string {
  return `📱 *অ্যাপ ডাউনলোড করুন:*\n${PLAY_STORE_URL}`;
}

/**
 * Store share data locally and in analytics
 */
export async function storeShareData(shareData: ShareData, shareType: 'text' | 'image' = 'text'): Promise<void> {
  try {
    // Store locally
    const existingData = await AsyncStorage.getItem(SHARE_DATA_KEY);
    const shares: ShareData[] = existingData ? JSON.parse(existingData) : [];
    
    // Add new share data
    shares.unshift(shareData);
    
    // Keep only the most recent shares
    const trimmedShares = shares.slice(0, MAX_STORED_SHARES);
    
    await AsyncStorage.setItem(SHARE_DATA_KEY, JSON.stringify(trimmedShares));

    // Store in analytics (async, don't wait)
    storeShareAnalytics({
      verseId: shareData.verseId,
      chapterId: shareData.chapterId,
      chapterNumber: shareData.chapterNumber,
      verseNumber: shareData.verseNumber,
      shareType,
      isTranslationOnly: shareData.isTranslationOnly || false,
    }).catch(error => {
      console.error('Error storing share analytics:', error);
    });
  } catch (error) {
    console.error('Error storing share data:', error);
  }
}

/**
 * Get all stored share data
 */
export async function getStoredShareData(): Promise<ShareData[]> {
  try {
    const data = await AsyncStorage.getItem(SHARE_DATA_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting stored share data:', error);
    return [];
  }
}

/**
 * Clear all stored share data
 */
export async function clearStoredShareData(): Promise<void> {
  try {
    await AsyncStorage.removeItem(SHARE_DATA_KEY);
  } catch (error) {
    console.error('Error clearing share data:', error);
  }
}

/**
 * Format verse text for WhatsApp sharing
 */
export function formatVerseForWhatsApp(
  verseText: string,
  translation: string,
  verseNumber: string,
  chapterNumber: string,
  speaker: string
): string {
  return `*শ্রীমদ্ভগবদগীতা*\n*অধ্যায় ${chapterNumber} - শ্লোক ${verseNumber}*\n\n*বক্তা:* ${speaker}\n\n*শ্লোক:*\n${verseText}\n\n*অনুবাদ:*\n${translation}\n\n_গীতা অ্যাপ থেকে শেয়ার করা হয়েছে_\n\n📱 *অ্যাপ ডাউনলোড করুন:*\n${PLAY_STORE_URL}`;
}

/**
 * Format translation verse text for WhatsApp sharing (translation only, no original verse)
 */
export function formatTranslationVerseForWhatsApp(
  translation: string,
  verseNumber: string,
  chapterNumber: string,
  speaker: string
): string {
  return `*শ্রীমদ্ভগবদগীতা*\n*অধ্যায় ${chapterNumber} - শ্লোক ${verseNumber}*\n\n*বক্তা:* ${speaker}\n\n*অনুবাদ:*\n${translation}\n\n_গীতা অ্যাপ থেকে শেয়ার করা হয়েছে_\n\n📱 *অ্যাপ ডাউনলোড করুন:*\n${PLAY_STORE_URL}`;
}

/**
 * Share verse as text to WhatsApp
 */
export async function shareVerseAsText(
  verseText: string,
  translation: string,
  verseNumber: string,
  chapterNumber: string,
  speaker: string
): Promise<boolean> {
  try {
    const formattedText = formatVerseForWhatsApp(
      verseText,
      translation,
      verseNumber,
      chapterNumber,
      speaker
    );
    
    // WhatsApp URL scheme
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(formattedText)}`;
    
    // Try to open WhatsApp
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
      return true;
    } else {
      // Fallback to general sharing using React Native Share
      try {
        await Share.share({
          message: formattedText,
          title: 'Share verse',
        });
        return true;
      } catch (shareError) {
        console.error('Error with Share API:', shareError);
        return false;
      }
    }
  } catch (error) {
    console.error('Error sharing verse as text:', error);
    return false;
  }
}

/**
 * Share translation verse as text to WhatsApp (translation only)
 */
export async function shareTranslationVerseAsText(
  translation: string,
  verseNumber: string,
  chapterNumber: string,
  speaker: string
): Promise<boolean> {
  try {
    const formattedText = formatTranslationVerseForWhatsApp(
      translation,
      verseNumber,
      chapterNumber,
      speaker
    );
    
    // WhatsApp URL scheme
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(formattedText)}`;
    
    // Try to open WhatsApp
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
      return true;
    } else {
      // Fallback to general sharing using React Native Share
      try {
        await Share.share({
          message: formattedText,
          title: 'Share translation',
        });
        return true;
      } catch (shareError) {
        console.error('Error with Share API:', shareError);
        return false;
      }
    }
  } catch (error) {
    console.error('Error sharing translation verse as text:', error);
    return false;
  }
}

/**
 * Share translation verse as image (translation only)
 */
export async function shareTranslationVerseAsImage(
  viewRef: React.RefObject<any>,
  verseId: string,
  chapterId: string,
  chapterNumber: string,
  verseNumber: string,
  translation: string,
  speaker: string
): Promise<boolean> {
  try {
    if (!viewRef.current) {
      return false;
    }

    // Capture the view as image
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 0.9,
      result: 'tmpfile',
    });

      // Store share data
      await storeShareData({
        verseId,
        chapterId,
        chapterNumber,
        verseNumber,
        translation,
        speaker,
        timestamp: Date.now(),
        isTranslationOnly: true,
      }, 'image');

    // Format message with download link
    const shareMessage = `*শ্রীমদ্ভগবদগীতা*\n*অধ্যায় ${chapterNumber} - শ্লোক ${verseNumber}*\n\n📱 *অ্যাপ ডাউনলোড করুন:*\n${PLAY_STORE_URL}`;

    // Try using expo-sharing first (requires native module, app needs rebuild)
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share translation as image',
          UTI: 'public.png',
        });
        return true;
      }
    } catch (sharingError: any) {
      // If expo-sharing fails (native module not available), fallback to Share API with message
    }

    // Fallback: Share the message with download link
    try {
      const result = await Share.share({
        message: shareMessage,
        title: 'Share translation',
      });
      return result.action !== Share.dismissedAction;
    } catch (shareError: any) {
      console.error('Error sharing with Share API:', shareError);
      return false;
    }
  } catch (error) {
    console.error('Error sharing translation verse as image:', error);
    return false;
  }
}

/**
 * Share verse as image to WhatsApp
 */
export async function shareVerseAsImage(
  viewRef: React.RefObject<any>,
  verseId: string,
  chapterId: string,
  chapterNumber: string,
  verseNumber: string,
  verseText: string,
  translation: string,
  speaker: string
): Promise<boolean> {
  try {
    if (!viewRef.current) {
      return false;
    }

    // Capture the view as image
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 0.9,
      result: 'tmpfile',
    });

    // Store share data
    await storeShareData({
      verseId,
      chapterId,
      chapterNumber,
      verseNumber,
      verseText,
      translation,
      speaker,
      timestamp: Date.now(),
    }, 'image');

    // Format message with download link
    const shareMessage = `*শ্রীমদ্ভগবদগীতা*\n*অধ্যায় ${chapterNumber} - শ্লোক ${verseNumber}*\n\n📱 *অ্যাপ ডাউনলোড করুন:*\n${PLAY_STORE_URL}`;

    // Try using expo-sharing first (requires native module, app needs rebuild)
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share verse as image',
          UTI: 'public.png',
        });
        return true;
      }
    } catch (sharingError: any) {
      // If expo-sharing fails (native module not available), fallback to Share API with message
    }

    // Fallback: Share the message with download link
    // Note: React Native Share API doesn't support file URIs, so we share the message
    // The image file is captured but can't be shared via Share API on Android
    try {
      const result = await Share.share({
        message: shareMessage,
        title: 'Share verse',
      });
      // Return true if shared successfully (not dismissed)
      return result.action !== Share.dismissedAction;
    } catch (shareError: any) {
      console.error('Error sharing with Share API:', shareError);
      return false;
    }
  } catch (error) {
    console.error('Error sharing verse as image:', error);
    return false;
  }
}

