import { ReactNode } from 'react';

interface GridItemProps {
    children: ReactNode;
    colSpan?: number;
}

function GridItem({ children, colSpan = 1 }: GridItemProps) {
    const itemClass = `grid grid-cols-1 gap-4 lg:col-span-${colSpan}`;

    return (
        <div className={itemClass}>
            {children}
        </div>
    );
}

export default GridItem;