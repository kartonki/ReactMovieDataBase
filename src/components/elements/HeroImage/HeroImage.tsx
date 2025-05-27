import React from 'react';
import './HeroImage.css';

interface HeroImageProps {
    image: string;
    title: string;
    text: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ image, title, text }) => {
    // Separate the gradient style for better readability
    const backgroundStyle = {
        background: `
            linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0) 39%,
                rgba(0, 0, 0, 0) 41%,
                rgba(0, 0, 0, 0.65) 100%
            ),
            url('${image}'),
            #1c1c1c
        `
    };

    return (
        <div className="rmdb-heroimage" style={backgroundStyle}>
            <div className="rmdb-heroimage-content">
                <div className="rmdb-heroimage-text">
                    <h1>{title}</h1>
                    <p>{text}</p>
                </div>
            </div>
        </div>
    );
};

export default HeroImage;