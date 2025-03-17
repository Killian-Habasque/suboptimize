import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
}

function Card({ children }: CardProps) {
    return (
        <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}

export default Card;