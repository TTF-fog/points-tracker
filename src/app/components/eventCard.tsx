'use client';
interface eventCardProps {
    name: string;
    position: number;
    points: number;
    color: string;
    date: Date;
   
}

export default function eventCard({ name, position, points, date, color }: eventCardProps) {
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="event-card" style={{ backgroundColor: color }}>
            <div className="event-header" style={{ backgroundColor: color }}>
                <div className="event-cell">Name</div>
                <div className="event-cell">Position</div>
                <div className="event-cell">Points</div>
                <div className="event-cell">Date</div>
            </div>
            <div className="event-row">
                <div className="event-cell">{name}</div>
                <div className="event-cell">{position}</div>
                <div className="event-cell">{points}</div>
                <div className="event-cell">{formatDate(date)}</div>
            </div>
        </div>
    );
}