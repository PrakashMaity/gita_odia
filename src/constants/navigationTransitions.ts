// Navigation transition configurations for Expo Router (Native Stack)
// Native Stack uses built-in animation presets with smooth, native animations

export type TransitionAnimation = 
  | 'default'
  | 'fade'
  | 'fade_from_bottom'
  | 'flip'
  | 'simple_push'
  | 'slide_from_bottom'
  | 'slide_from_right'
  | 'slide_from_left'
  | 'none';

// Animation presets for different screen types
export const TRANSITION_ANIMATIONS = {
  // Default smooth slide from right (for most content screens)
  default: 'slide_from_right' as TransitionAnimation,
  
  // Fade transition (for onboarding and initial screens)
  fade: 'fade' as TransitionAnimation,
  
  // Slide from bottom (for modal-like screens)
  modal: 'slide_from_bottom' as TransitionAnimation,
  
  // Fade from bottom (for special overlays)
  fadeFromBottom: 'fade_from_bottom' as TransitionAnimation,
  
  // Simple push (for quick transitions)
  simple: 'simple_push' as TransitionAnimation,
  
  // Flip animation (for special screens)
  flip: 'flip' as TransitionAnimation,
} as const;

