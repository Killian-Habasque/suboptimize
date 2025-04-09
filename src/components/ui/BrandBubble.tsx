import React from 'react';

interface BrandBubbleProps {
    image: string;
    altText?: string;
    className?: string;
}

const BrandBubble: React.FC<BrandBubbleProps> = ({ image, altText, className }) => {
    return (
        <div className={`min-w-16 w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center ${className}`}>
            <img src={image} alt={altText} className='w-10 h-10' />
        </div>
    );
};

export default BrandBubble; 