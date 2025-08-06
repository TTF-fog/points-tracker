'use client';
import EventGroup from './eventGroup';

interface eventListProps {
    events: {
        name: string;
        position: number;
        points: number;
        date: Date;
        color: string;
    }[];
}

function parseEvents(events: {name: string, position: number, points: number, date: Date, color: string}[]) {
    let parsedEvents: Record<string, Array<{name: string, position: number, points: number, date: Date, color: string}>> = {};
    for (const event of events) {
        if (!parsedEvents[event.name]) { 
            parsedEvents[event.name] = [];
        }
        parsedEvents[event.name].push({
            name: event.name,
            position: event.position,
            points: event.points,
            date: event.date,
            color: event.color
        });
    }
    return parsedEvents;
}

export default function EventList({ events }: eventListProps) {
    const parsedEvents = parseEvents(events);
    
    return (
        <div className="event-list">
            {Object.entries(parsedEvents).map(([eventName, eventGroup]) => (
                <EventGroup
                    key={eventName}
                    eventName={eventName}
                    events={eventGroup}
                />
            ))}
        </div>
    );
}