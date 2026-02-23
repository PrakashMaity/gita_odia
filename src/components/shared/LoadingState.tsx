import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { LoadingStateProps } from '@/types/screen.interface';
import React from 'react';

export const LoadingState: React.FC<LoadingStateProps> = ({ message }) => {
  return (
    <Box className="flex-1 items-center justify-center bg-black">
      {message && (
        <Text className="text-lg text-neutral-400 font-regional_secondary text-center max-w-[80%] mt-4">
          {message}
        </Text>
      )}
    </Box>
  );
};
