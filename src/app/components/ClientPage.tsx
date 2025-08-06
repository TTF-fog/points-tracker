'use client';

import Button from './Button';
import EventList from './eventList';

interface ClientPageProps {
    initialHouses: Array<{
        _id: string;
        name: string;
        points: number;
        events: Array<{
            name: string;
            position: number;
            points: number;
        }>;
    }>;
    //i am a very good programmer and i am very good at programming (i have no idea how to use react)
    initialEvents: Array<{
        name: string;
        position: number;
        points: number;
        color: string;
        date: Date;
    }>;
    Lion_Events: Array<{
        name: string;
        position: number;
        points: number;
    }>;
    Tiger_Events: Array<{
        name: string;
        position: number;
        points: number;
    }>;
    Panther_Events: Array<{
        name: string;
        position: number;
        points: number;
    }>;
    Leopard_Events: Array<{
        name: string;
        position: number;
        points: number;
    }>;
}

export default function ClientPage({ initialHouses, initialEvents }: ClientPageProps) {

    const houses = Array.isArray(initialHouses) ? initialHouses : [];
    const events = Array.isArray(initialEvents) ? initialEvents : [];
    console.log(events[0]);
   
    return (
        <div>
            <h1 >Scores</h1>
            <div className="hi2">
                {houses.map((house) => (
                    <Button 
                        key={house._id} 
                        house={house.name} 
                        count={house.points}
                        events={events}
                    />
                ))}
               
            </div>
            <div>
            <h1 > House Events</h1>
            <EventList events={events} />
        </div>
        <footer>Designed By <a href="https://github.com/TTF-fog">Ishaan Adhikari</a> for SNSG </footer>
        
        </div>
    );
} 