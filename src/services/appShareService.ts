import * as Linking from 'expo-linking';
import { Share } from 'react-native';
import { storeAppShareAnalytics } from './shareAnalyticsService';

// Play Store download link
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.proninja.bhagavad_gita';
const APP_STORE_URL = 'https://apps.apple.com/app/id[APP_ID]'; // Update with actual App Store ID when available

/**
 * Format app share message
 */
function formatAppShareMessage(): string {
  return `*শ্রীমদ্ভগবদগীতা*\n\nগীতা অ্যাপে আপনি পাবেন:\n\n✨ ১৮টি অধ্যায়ের সম্পূর্ণ পাঠ\n📖 বাংলা অনুবাদ সহ\n🎧 অডিও পাঠ\n📱 সুন্দর ও সহজ ইন্টারফেস\n\n📱 *অ্যাপ ডাউনলোড করুন:*\n${PLAY_STORE_URL}\n\n_গীতা অ্যাপ থেকে শেয়ার করা হয়েছে_`;
}

/**
 * Share app to WhatsApp
 */
export async function shareAppToWhatsApp(): Promise<boolean> {
  try {
    const formattedText = formatAppShareMessage();

    // WhatsApp URL scheme
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(formattedText)}`;

    // Try to open WhatsApp
    const canOpen = await Linking.canOpenURL(whatsappUrl);

    if (canOpen) {
      await Linking.openURL(whatsappUrl);

      // Track app share
      storeAppShareAnalytics().catch(error => {
        console.error('Error storing app share analytics:', error);
      });

      return true;
    } else {
      // Fallback to general sharing using React Native Share
      try {
        const result = await Share.share({
          message: formattedText,
          title: 'Share App',
        });

        if (result.action !== Share.dismissedAction) {
          // Track app share
          storeAppShareAnalytics().catch(error => {
            console.error('Error storing app share analytics:', error);
          });
        }

        return result.action !== Share.dismissedAction;
      } catch (shareError) {
        console.error('Error with Share API:', shareError);
        return false;
      }
    }
  } catch (error) {
    console.error('Error sharing app:', error);
    return false;
  }
}

/**
 * Share app using native share dialog
 */
export async function shareApp(): Promise<boolean> {
  try {
    const formattedText = formatAppShareMessage();

    try {
      const result = await Share.share({
        message: formattedText,
        title: 'Share App',
      });

      if (result.action !== Share.dismissedAction) {
        // Track app share
        storeAppShareAnalytics().catch(error => {
          console.error('Error storing app share analytics:', error);
        });
      }

      return result.action !== Share.dismissedAction;
    } catch (shareError) {
      console.error('Error with Share API:', shareError);
      return false;
    }
  } catch (error) {
    console.error('Error sharing app:', error);
    return false;
  }
}

