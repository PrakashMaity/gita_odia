/**
 * Utility functions for Text-to-Speech operations
 * Reusable functions that can be used across the app
 */

export const MAX_TEXT_LENGTH = 4000; // expo-speech limit

/**
 * Split text into chunks at sentence boundaries, respecting max length
 * @param text - Text to split
 * @param maxLength - Maximum length per chunk (default: MAX_TEXT_LENGTH)
 * @returns Array of text chunks
 */
export const splitTextIntoChunks = (text: string, maxLength: number = MAX_TEXT_LENGTH): string[] => {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  let currentChunk = '';
  
  // Split by sentences (period, exclamation, question mark)
  const sentences = text.split(/([.!?]\s+)/);
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const potentialChunk = currentChunk + sentence;
    
    if (potentialChunk.length <= maxLength) {
      currentChunk = potentialChunk;
    } else {
      // If current chunk has content, save it
      if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        // Single sentence is too long, split by words
        const words = sentence.split(/(\s+)/);
        let wordChunk = '';
        
        for (const word of words) {
          if ((wordChunk + word).length <= maxLength) {
            wordChunk += word;
          } else {
            if (wordChunk.trim().length > 0) {
              chunks.push(wordChunk.trim());
            }
            wordChunk = word;
          }
        }
        
        if (wordChunk.trim().length > 0) {
          currentChunk = wordChunk;
        }
      }
    }
  }
  
  // Add remaining chunk
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length > 0 ? chunks : [text.substring(0, maxLength)];
};

/**
 * Delay helper for async operations
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

