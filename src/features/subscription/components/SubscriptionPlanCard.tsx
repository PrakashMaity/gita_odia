import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';

interface SubscriptionPlanCardProps {
  title: string;
  price: string;
  period: string;
  onPurchase: () => Promise<void>;
  isPurchasing: boolean;
  showBestValue?: boolean;
  features?: string[];
}

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  title,
  price,
  period,
  onPurchase,
  isPurchasing,
  showBestValue = false,
  features = [],
}) => {
  const handlePress = async () => {
    await onPurchase();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isPurchasing}
      activeOpacity={0.9}
      className={`mb-4 w-full rounded-3xl border ${showBestValue ? 'border-white bg-black' : 'border-neutral-800 bg-neutral-900'
        } overflow-hidden`}
    >
      <Box className="relative p-6 pt-8">
        {showBestValue && (
          <Box className="absolute top-0 right-6 bg-white flex-row items-center px-3 py-1.5 rounded-b-xl shadow-sm z-10">
            <MaterialIcons name="star" size={12} color="black" />
            <Text className="text-[10px] font-bold text-black ml-1 uppercase font-regional_secondary tracking-wider">
              {i18n.t('subscription.bestValue')}
            </Text>
          </Box>
        )}

        <Text className="text-xl font-bold mb-4 font-regional_secondary text-white">
          {title}
        </Text>

        <Box className="mb-6 flex-row items-baseline">
          <Text className={`text-4xl font-bold font-regional_secondary ${showBestValue ? 'text-white' : 'text-neutral-200'}`}>
            {price}
          </Text>
          <Text className="text-base text-neutral-400 font-regional_secondary ml-2">
            {period}
          </Text>
        </Box>

        {features.length > 0 && (
          <Box className="mb-8 gap-4">
            {features.map((feature, index) => (
              <Box key={index} className="flex-row items-start pr-4">
                <MaterialIcons
                  name="check-circle"
                  size={20}
                  color={showBestValue ? 'white' : '#9ca3af'}
                  style={{ marginTop: 2, marginRight: 12 }}
                />
                <Text className="text-sm leading-6 text-neutral-300 font-regional_secondary flex-1">
                  {feature}
                </Text>
              </Box>
            ))}
          </Box>
        )}

        <Button
          size="xl"
          style={{ width: '100%' }}
          onPress={handlePress}
          disabled={isPurchasing}
          className={`${showBestValue ? 'bg-white' : 'bg-neutral-800'}`}
        >
          {isPurchasing ? (
            <ButtonSpinner color={showBestValue ? 'black' : 'white'} />
          ) : (
            <ButtonText className={`font-bold ${showBestValue ? 'text-black' : 'text-white'}`}>
              {i18n.t('subscription.subscribe')}
            </ButtonText>
          )}
        </Button>
      </Box>
    </TouchableOpacity>
  );
};
