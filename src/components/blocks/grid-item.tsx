import { ReactNode } from 'react';

interface GridItemProps {
    children: ReactNode;
    colSpan?: number;
}

function GridItem({ children, colSpan = 1 }: GridItemProps) {
    const itemClass = `grid grid-cols-1 gap-4 lg:col-span-${colSpan}`;

    return (
        <div className={itemClass}>
            <div className="overflow-hidden rounded-lg bg-white shadow">
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default GridItem;
