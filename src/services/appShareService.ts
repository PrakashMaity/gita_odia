import * as Linking from 'expo-linking';
import { Share } from 'react-native';
import i18n from '../lib/i18n';
import { storeAppShareAnalytics } from './shareAnalyticsService';

// Play Store download link
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.proninja.bhagavad_gita';

/**
 * Format app share message
 */
function formatAppShareMessage(): string {
  return `*${i18n.t('share.appTitle')}*\n\n${i18n.t('share.appFeatures')}\n\n✨ ${i18n.t('share.feature1').replace('• ', '')}\n📖 ${i18n.t('share.feature2').replace('• ', '')}\n🎧 ${i18n.t('share.feature3').replace('• ', '')}\n📱 ${i18n.t('share.feature4').replace('• ', '')}\n\n📱 *${i18n.t('share.downloadApp')}:*\n${PLAY_STORE_URL}\n\n_${i18n.t('share.sharedFrom')}_`;
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
          title: i18n.t('share.title'),
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
        title: i18n.t('share.title'),
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

