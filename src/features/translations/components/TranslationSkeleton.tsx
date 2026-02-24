import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Skeleton } from '@/components/ui/skeleton';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { ScrollView } from 'react-native';

const TranslationCardSkeleton = () => (
    <Box className="mb-4">
        <Box className="rounded-[24px] border border-primary-50/50 p-3 bg-white shadow-sm overflow-hidden">
            <HStack className="items-center">
                <Skeleton className="w-[72px] h-[72px] rounded-[16px] mr-4" />
                <VStack className="flex-1 justify-center space-y-2">
                    <Skeleton className="h-5 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                </VStack>
                <Skeleton className="w-8 h-8 rounded-full ml-3" />
            </HStack>
        </Box>
    </Box>
);

const TranslationIntroSkeleton = () => (
    <Box className="rounded-[24px] border border-primary-50/50 p-6 bg-white shadow-sm overflow-hidden mb-6 min-h-[120px]">
        <VStack space="md">
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <VStack space="xs">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
            </VStack>
        </VStack>
    </Box>
);

const TranslationMotivationSkeleton = () => (
    <Box className="rounded-[24px] border border-success-50/10 p-5 bg-white shadow-sm overflow-hidden mb-8 min-h-[100px]">
        <HStack className="items-center mb-3">
            <Skeleton className="w-1.5 h-6 rounded-[2px] mr-3" />
            <Skeleton className="h-6 w-1/2 rounded-md" />
        </HStack>
        <VStack space="xs">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
        </VStack>
    </Box>
);

export const TranslationsLoadingSkeleton = () => {
    return (
        <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
            <VStack>
                <TranslationIntroSkeleton />
                <TranslationCardSkeleton />
                <TranslationCardSkeleton />
                <TranslationCardSkeleton />
                <TranslationCardSkeleton />
                <TranslationCardSkeleton />
                <TranslationMotivationSkeleton />
            </VStack>
        </ScrollView>
    );
};
