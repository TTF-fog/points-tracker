'use client';
import { useState } from 'react';
import EventCard from './eventCard';

interface EventGroupProps {
    eventName: string;
    events: Array<{
        name: string;
        position: number;
        points: number;
        date: Date;
        color: string;
    }>;
}

export default function EventGroup({ eventName, events }: EventGroupProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="event-group">
            <div 
                className="event-group-header" 
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ cursor: 'pointer' }}
            >
                <span>{isExpanded ? '▼' : '▶'} {eventName}</span>
            </div>
            {isExpanded && (
                <div className="event-group-content">
                    {events.map((event, index) => (
                        <EventCard
                            key={index}
                            name={event.name}
                            position={event.position}
                            points={event.points}
                            color={event.color}
                            date={event.date}
                        />
                    ))}
                </div>
            )}
        </div>
    );
} 