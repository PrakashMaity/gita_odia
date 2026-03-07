import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { EmptyStateProps } from '@/types/screen.interface';
import React from 'react';

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
}) => {
  return (
    <Box className="flex-1 items-center justify-center p-6 bg-primary-50">
      {icon}
      <Text className="text-xl font-bold mt-4 text-center text-primary-950 font-regional_secondary">
        {title}
      </Text>
      {subtitle && (
        <Text className="text-base mt-2 text-center text-primary-600 font-regional_secondary">
          {subtitle}
        </Text>
      )}
    </Box>
  );
};
