import { useThemeColors } from '@/hooks/useTheme'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

function ThemedSafeAreaView({children}: {children: React.ReactNode}) {
    const theme = useThemeColors()
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:theme.background.primary  }}>
            {children}
    </SafeAreaView>
  )
}

export default ThemedSafeAreaView