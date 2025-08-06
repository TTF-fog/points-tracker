'use client';

import { useState } from 'react';
import EventCard from './eventCard';

interface ButtonProps {
    house: string;
    count: number;
    events: Array<{
        name: string;
        position: number;
        points: number;
        date: Date;
        color: string;
    }>;
}

export default function house_card({ house: house_card, count, events }: ButtonProps) {
    const [showEvents, setShowEvents] = useState(false);
    
    const getHouseColor = (house: string) => {
        switch(house.toLowerCase()) {
            case 'tigers': return 'red';
            case 'lions': return 'yellow';
            case 'leopards': return 'green';
            case 'panthers': return 'blue';
            default: return 'white';
        }
    };

    const filteredEvents = events.filter(event => event.color === getHouseColor(house_card));

    return (
        <div className={`house-card ${showEvents ? 'expanded' : ''}`}>
            <div className="house-card-header">
                <h2>{house_card}</h2>
                <p>Points: {count}</p>
                <button onClick={() => setShowEvents(!showEvents)}>
                    {showEvents ? 'Hide Events' : 'Show Events For House'}
                </button>
            </div>
            {showEvents && (
                <div className="house-events">
                    {filteredEvents.map((event, index) => (
                        <EventCard
                            key={index}
                            name={event.name}
                            position={event.position}
                            points={event.points}
                            date={event.date}
                            color={event.color}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
