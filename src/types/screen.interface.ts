// Search Screen Interfaces
export interface SearchResult {
  chapterNumber: number;
  verseNumber: number;
  verseText: string;
  translation: string;
  speaker: string;
  matchType: 'sanskrit' | 'Language' | 'translation';
}

// Onboarding Screen Interfaces
export interface OnboardingSlide {
  id: number;
  image: any;
  title: string;
  subtitle: string;
  description: string;
}

// Page Header Interface
export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  onBack?: () => void;
}

// Empty State Interface
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}

// Loading State Interface
export interface LoadingStateProps {
  message?: string;
}

