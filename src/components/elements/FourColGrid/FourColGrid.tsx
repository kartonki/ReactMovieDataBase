import React, { ReactNode } from 'react';
import './FourColGrid.css';

interface FourColGridProps {
  header?: string;
  loading?: boolean;
  children: ReactNode[];
}

const FourColGrid: React.FC<FourColGridProps> = ({ header, loading, children }) => {

    const renderElements = () => {
        const gridElements = children.map( (element, i) => (
            <div key={i} className="rmdb-grid-element">
                {element}
            </div>
        ))
        return gridElements;
    }

    return (
        <div className="rmdb-grid">
            {header && !loading ? <h1>{header}</h1> : null}
            <div className="rmdb-grid-content">
                {renderElements()}
            </div>
        </div>
    )
}

export default FourColGrid;