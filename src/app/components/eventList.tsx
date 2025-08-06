'use client';
import EventCard from './eventCard';
interface eventListProps {
    events: {
        name: string;
        position: number;
        points: number;
        color: string;
    }[];
}

export default function EventList({ events }: eventListProps) {
    return (
        <div>
         
            <ul>
                {events.map((event) => (
                    <EventCard name={event.name} position={event.position} points={event.points} color={event.color} />
                ))}
            </ul>
        </div>
    )
}