import React from 'react';
import { IMAGE_BASE_URL } from '../../../config';
import './Actor.css';
import ImageWebp from '../ImageWebP/ImageWebp';

interface ActorType {
  profile_path: string | null;
  name: string;
  character: string;
}

interface ActorProps {
  actor: ActorType;
}

const Actor: React.FC<ActorProps> = ({ actor }) => {

  const POSTER_SIZE = "w154";

  return (
    <div className="rmdb-actor">
      <ImageWebp
        src={actor.profile_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${actor.profile_path}` : './images/no_image.jpg'}
        alt="actorthumb"
      />
      <span className="rmdb-actor-name">{actor.name}</span>
      <span className="rmdb-actor-character">{actor.character}</span>
    </div>
  )
}

export default Actor;