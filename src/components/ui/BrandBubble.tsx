import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';
import Image from 'next/image';

interface BrandBubbleProps {
  image?: string | null;
  altText?: string;
  className?: string;
  brandName?: string;
  variant?: 'small' | 'medium' | 'large'; 
}

const BrandBubble: React.FC<BrandBubbleProps> = ({
  image,
  altText,
  brandName,
  className,
  variant = 'medium',
}) => {
  const sizeClasses =
    variant === 'small'
      ? 'min-w-4 w-4 h-4 rounded-full text-xs'
      : variant === 'medium'
      ? 'min-w-14 w-14 h-14 rounded-xl text-lg' 
      : 'min-w-24 w-24 h-24 rounded-2xl text-2xl';

  const imageSize =
    variant === 'small' ? 16 :
    variant === 'medium' ? 40 :
    56; 

  const iconSizeClasses =
    variant === 'small'
      ? 'w-4 h-4'
      : variant === 'medium'
      ? 'w-8 h-8'
      : 'w-14 h-14'; 

  return (
    <div className={`${sizeClasses} shadow-lg flex items-center justify-center ${className}`}>
      {image ? (
        <Image
          src={image}
          alt={altText || "Brand logo"}
          width={imageSize}
          height={imageSize}
          className="object-contain"
        />
      ) : brandName ? (
        <div className="w-full h-full flex items-center justify-center rounded-full">
          <span className="text-secondary">{brandName.charAt(0)}</span>
        </div>
      ) : (
        <QuestionMarkCircleIcon className={`${iconSizeClasses} text-secondary`} />
      )}
    </div>
  );
};

export default BrandBubble;