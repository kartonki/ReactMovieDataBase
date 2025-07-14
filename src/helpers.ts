// Convert time to hours and minutes
export const calcTime = (time: number): string => {
  const hours = Math.floor(time / 60);
  const mins = time % 60;
  return `${hours}h ${mins}m`;
}
// Convert a number to money formatting
export const convertMoney = (money: number): string => {
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  });
  return formatter.format(money);
}

// TMDB Image size configurations
export const POSTER_SIZES = ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'] as const;
export const BACKDROP_SIZES = ['w300', 'w780', 'w1280', 'original'] as const;

// Generate responsive srcset for TMDB images
export const generateImageSrcSet = (
  baseUrl: string, 
  imagePath: string, 
  sizes: readonly string[],
  includeOriginal: boolean = true
): string => {
  if (!imagePath) return '';
  
  const srcSetEntries: string[] = [];
  
  // Add sized versions
  sizes.forEach(size => {
    if (size !== 'original') {
      const width = size.replace('w', '');
      srcSetEntries.push(`${baseUrl}${size}${imagePath} ${width}w`);
    }
  });
  
  // Add original size if requested and if we have width info
  if (includeOriginal && sizes.includes('original')) {
    // For original, we'll use a high estimate since we don't know the exact width
    srcSetEntries.push(`${baseUrl}original${imagePath} 2000w`);
  }
  
  return srcSetEntries.join(', ');
};

// Generate poster srcset
export const generatePosterSrcSet = (baseUrl: string, imagePath: string): string => {
  return generateImageSrcSet(baseUrl, imagePath, POSTER_SIZES);
};

// Generate backdrop srcset  
export const generateBackdropSrcSet = (baseUrl: string, imagePath: string): string => {
  return generateImageSrcSet(baseUrl, imagePath, BACKDROP_SIZES);
};