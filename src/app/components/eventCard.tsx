'use client';
interface eventCardProps {
    name: string;
    position: number;
    points: number;
    color: string;
}

export default function eventCard({ name, position, points, color }: eventCardProps) {
    console.log(name, position, points, color);
    return (
        <div className="event-card" style={{ backgroundColor: color }}>
            <div className="event-header" style={{ backgroundColor: color }}>
                <div className="event-cell">Name</div>
                <div className="event-cell">Position</div>
                <div className="event-cell">Points</div>
            </div>
            <div className="event-row">
                <div className="event-cell">{name}</div>
                <div className="event-cell">{position}</div>
                <div className="event-cell">{points}</div>
            </div>
        </div>
    );
}