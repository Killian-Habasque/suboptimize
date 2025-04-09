import React from 'react';

interface DueTypeProps {
    type: 'annuel' | 'mensuel';
}

const DueTypeBadge: React.FC<DueTypeProps> = ({ type }) => {
    const isAnnuel = type === 'annuel';
    return (
        <div className={`py-1 px-4 rounded-full flex gap-2 items-center text-sm font-normal ${isAnnuel ? 'bg-green-200 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
            <span className={`w-2 h-2 ${isAnnuel ? 'bg-green-500' : 'bg-blue-500'} rounded-full`}></span>
            {isAnnuel ? 'Annuel' : 'Mensuel'}
        </div>
    );
};

export default DueTypeBadge; 