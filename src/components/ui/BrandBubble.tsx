import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';
import Image from 'next/image';

interface BrandBubbleProps {
    image?: string | null;
    altText?: string;
    className?: string;
}

const BrandBubble: React.FC<BrandBubbleProps> = ({ image, altText, className }) => {
    return (
        <div className={`min-w-16 w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center ${className}`}>
            {image ? 
                <Image 
                    src={image} 
                    alt={altText || "Brand logo"} 
                    width={40} 
                    height={40}
                    className='object-contain' 
                /> : 
                <QuestionMarkCircleIcon className='w-10 h-10'/>
            }
        </div>
    );
};

export default BrandBubble; 