import React, { ReactNode } from 'react';
import './FourColGrid.css';

interface FourColGridProps {
    header?: string;
    loading?: boolean;
    children: ReactNode; // Changed from ReactNode[]
}

const FourColGrid: React.FC<FourColGridProps> = ({ header, loading, children }) => (
    <div className="rmdb-grid">
        {header && !loading && <h1>{header}</h1>}
        <div className="rmdb-grid-content">
            {React.Children.map(children, (child, index) => (
                <div key={index} className="rmdb-grid-element">
                    {child}
                </div>
            ))}
        </div>
    </div>
);

export default FourColGrid;
