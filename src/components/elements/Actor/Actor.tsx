import React from 'react';
import { IMAGE_BASE_URL } from '../../../config';
import './Actor.css';
import ImageWebp from '../ImageWebP/ImageWebp';

// Move constants outside component to avoid recreating on each render
const POSTER_SIZE = "w154";
const DEFAULT_IMAGE = './images/no_image.jpg';

// Better type naming and more specific types
interface ActorData {
    profile_path: string | null;
    name: string;
    character: string;
    cast_id: number;
}

const Actor: React.FC<{ actor: ActorData }> = ({ actor }) => {
    const imageUrl = actor.profile_path 
        ? `${IMAGE_BASE_URL}${POSTER_SIZE}${actor.profile_path}`
        : DEFAULT_IMAGE;

    return (
        <div className="rmdb-actor">
            <ImageWebp
                src={imageUrl}
                alt={`${actor.name} as ${actor.character}`} // More descriptive alt text
            />
            <span className="rmdb-actor-name">{actor.name}</span>
            <span className="rmdb-actor-character">{actor.character}</span>
        </div>
    );
};

export default Actor;