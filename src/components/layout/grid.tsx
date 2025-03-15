import { ReactNode } from 'react';

interface GridProps {
    children: ReactNode;
    columns?: number;
}

function Grid({ children, columns = 1 }: GridProps) {
    const gridClass = `grid grid-cols-1 gap-4 items-start lg:grid-cols-${columns} lg:gap-8`;

    return (
        <div className={gridClass}>
            {children}
        </div>
    );
}

export default Grid;