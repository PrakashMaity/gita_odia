import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
import React from 'react';

export const ErrorState: React.FC = () => {
  return (
    <Box className="flex-1 justify-center items-center p-6 bg-primary-50">
      <Text className="text-tertiary-500 text-base text-center font-regional_secondary">
        {i18n.t('chapter.notFound')}
      </Text>
    </Box>
  );
};
