import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
}

function Card({ children, className }: CardProps) {
    return (
        <div className={`overflow-hidden rounded-lg bg-white shadow ${className || ''}`}>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

export default Card;
export type { CardProps };