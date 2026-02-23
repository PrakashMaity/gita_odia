import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Skeleton } from '@/components/ui/skeleton';
import { VStack } from '@/components/ui/vstack';
import React from 'react';
import { ScrollView } from 'react-native';

const ChapterCardSkeleton = () => (
    <Box className="w-full mb-4 px-4">
        <Box className="w-full rounded-[24px] p-3 border border-amber-50/50 bg-white shadow-sm flex-row items-center">
            <Skeleton className="w-[84px] h-[84px] rounded-[18px] mr-4" />
            <VStack className="flex-1 justify-center py-1">
                <Skeleton className="h-5 w-3/4 mb-2 rounded-md" />
                <Skeleton className="h-3 w-1/2 mb-2 rounded-md" />
                <Box className="mt-2 w-[80%]">
                    <Skeleton className="h-1.5 w-full rounded-full" />
                </Box>
            </VStack>
            <Skeleton className="w-8 h-8 rounded-full ml-2 mr-1" />
        </Box>
    </Box>
);

const MangalacharanSkeleton = () => (
    <Box className="px-4 mb-4">
        <Box className="bg-white rounded-[24px] border border-amber-50/50 p-6 shadow-sm overflow-hidden min-h-[140px]">
            <VStack space="md">
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <VStack space="xs">
                    <Skeleton className="h-4 w-full rounded-md" />
                    <Skeleton className="h-4 w-5/6 rounded-md" />
                    <Skeleton className="h-4 w-4/5 rounded-md" />
                </VStack>
            </VStack>
        </Box>
    </Box>
);

const MotivationSkeleton = () => (
    <Box className="px-4 mt-6 mb-8">
        <Box className="bg-white rounded-[28px] p-6 border border-amber-50/50 shadow-sm min-h-[120px]">
            <HStack className="items-center mb-3">
                <Skeleton className="w-10 h-10 rounded-[16px] mr-3" />
                <Skeleton className="h-6 flex-1 rounded-md" />
            </HStack>
            <Skeleton className="h-4 w-full rounded-md mb-2" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
        </Box>
    </Box>
);

export const ChaptersLoadingSkeleton = () => {
    return (
        <Box className="flex-1">
            {/* Mock Header space */}
            <Box className="h-16 w-full" />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <VStack className="pt-4">
                    <MangalacharanSkeleton />
                    <ChapterCardSkeleton />
                    <ChapterCardSkeleton />
                    <ChapterCardSkeleton />
                    <ChapterCardSkeleton />
                    <MotivationSkeleton />
                </VStack>
            </ScrollView>
        </Box>
    );
};
