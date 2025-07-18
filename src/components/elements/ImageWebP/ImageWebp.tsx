import React, { useState, useEffect } from 'react';

interface ImageWebpProps {
    src: string;
    srcWebp?: string;
    srcSet?: string;
    srcSetWebp?: string;
    sizes?: string;
    className?: string;
    style?: React.CSSProperties;
    width?: string | number;
    height?: string | number;
    onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
    onMouseMove?: (e: React.MouseEvent<HTMLImageElement>) => void;
    onMouseLeave?: (e: React.MouseEvent<HTMLImageElement>) => void;
    alt?: string;
    loading?: 'lazy' | 'eager';
}

interface WebpSupport {
    NONE: boolean;
    ALL?: boolean;
    lossy?: boolean;
    lossless?: boolean;
    alpha?: boolean;
    animation?: boolean;
}

const TRANSPARENT_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const WEBP_TEST_IMAGES = {
    lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
    lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
    alpha: 'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
    animation: 'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
};

const useWebpSupport = () => {
    const [webpSupport, setWebpSupport] = useState<WebpSupport | null>(() => {
        const stored = localStorage.getItem('webpSupport');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (webpSupport) return;

        const checkWebpSupport = async () => {
            const support: WebpSupport = { NONE: true };
            let compatibleCount = 0;

            await Promise.all(
                Object.entries(WEBP_TEST_IMAGES).map(
                    ([format, base64]) => {
                        return new Promise<void>((resolve) => {
                            const img = new Image();
                            img.onload = () => {
                                const isSupported = img.width > 0 && img.height > 0;
                                support[format as keyof WebpSupport] = isSupported;
                                if (isSupported) {
                                    support.NONE = false;
                                    compatibleCount++;
                                }
                                resolve();
                            };
                            img.onerror = () => {
                                support[format as keyof WebpSupport] = false;
                                resolve();
                            };
                            img.src = `data:image/webp;base64,${base64}`;
                        });
                    }
                )
            );

            support.ALL = compatibleCount === Object.keys(WEBP_TEST_IMAGES).length;
            localStorage.setItem('webpSupport', JSON.stringify(support));
            setWebpSupport(support);
        };

        checkWebpSupport();
    }, [webpSupport]);

    return webpSupport;
};

const ImageWebp: React.FC<ImageWebpProps> = ({
    src,
    srcWebp,
    srcSet,
    srcSetWebp,
    sizes,
    className,
    style,
    width,
    height,
    onLoad,
    onMouseMove,
    onMouseLeave,
    alt = '',
    loading,
}) => {
    const webpSupport = useWebpSupport();
    const [imageLoaded, setImageLoaded] = useState(false);
    
    const getImageSource = (): string => {
        if (!srcWebp || !webpSupport) return src;
        
        if (webpSupport.ALL) return srcWebp;
        
        if (!webpSupport.NONE) {
            if (srcWebp.endsWith('.alpha.webp') && webpSupport.alpha) return srcWebp;
            if (srcWebp.endsWith('.lossless.webp') && webpSupport.lossless) return srcWebp;
        }
        
        return src;
    };

    const getImageSrcSet = (): string | undefined => {
        if (!srcSet && !srcSetWebp) return undefined;
        
        if (!srcSetWebp || !webpSupport) return srcSet;
        
        if (webpSupport.ALL) return srcSetWebp;
        
        if (!webpSupport.NONE) {
            // For simplicity, if any webp support exists, use webp srcset
            if (webpSupport.alpha || webpSupport.lossless || webpSupport.lossy) {
                return srcSetWebp;
            }
        }
        
        return srcSet;
    };

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        setImageLoaded(true);
        if (onLoad && e.currentTarget.src !== TRANSPARENT_IMAGE) {
            onLoad(e);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
        if (onMouseMove && e.currentTarget.src !== TRANSPARENT_IMAGE) {
            onMouseMove(e);
        }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLImageElement>) => {
        if (onMouseLeave && e.currentTarget.src !== TRANSPARENT_IMAGE) {
            onMouseLeave(e);
        }
    };

    // Create style to maintain dimensions and prevent layout shift
    const imageStyle: React.CSSProperties = {
        ...style,
        display: 'block',
        // Reserve space with proper aspect ratio during loading
        aspectRatio: className?.includes('moviethumb') ? '2 / 3' : 'auto',
        backgroundColor: imageLoaded ? 'transparent' : '#f0f0f0',
        transition: 'background-color 0.3s ease'
    };

    return (
        <img
            src={webpSupport ? getImageSource() : TRANSPARENT_IMAGE}
            srcSet={webpSupport ? getImageSrcSet() : undefined}
            sizes={sizes}
            className={className}
            style={imageStyle}
            width={width}
            height={height}
            onLoad={handleLoad}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            alt={alt}
            loading={loading}
        />
    );
};

export default ImageWebp;
