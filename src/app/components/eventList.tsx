'use client';
import EventCard from './eventCard';

interface eventListProps {
    events: {
        name: string;
        position: number;
        points: number;
        date: Date;
        color: string;
    }[];
}

export default function EventList({ events }: eventListProps) {
    return (
        <div>
            <ul>
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
            </ul>
        </div>
    );
}