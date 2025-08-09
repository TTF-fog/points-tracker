"use client";
import { useState } from "react";
import eventCard from "../components/eventCard";
import EventCard from "../components/eventCard";
import { addEventByHouseName } from "@/db_utils/manager";
let HOUSES = ["Lions", "Tigers", "Panthers", "Leopards"];
const HOUSE_COLORS = {
    "Lions": "#FFD700", // Yellow
    "Tigers": "#FF4444", // Red
    "Panthers": "#4444FF", // Blue
    "Leopards": "#44FF44" // Green
};

interface Event {
    name: string;
    position: number;
    points: number;
    date: Date;
    house: string;
}
// //TODO: refactor code to not use record
// async function setOnDB(events: Record<string, Array<Event>>, eventName: string){
//     for (const event of events[eventName]){
//         // house is determined by owner of array
//         let parsed_event ={
//             name: event.name,
//             position: event.position,
//             points: event.points,
//             date: event.date,
//         }
//         await addEventByHouseName(event.house, parsed_event);
//     }
// }
// eslint-disable-next-line prefer-const
let events: Record<string, Array<Event>> = {};
export default function EventEntry() {
    const [eventName, setEventName] = useState("");
    const [showWidget, setShowWidget] = useState(false);
    const [currentHouse, setCurrentHouse] = useState(0);
    const [points, setPoints] = useState(0);
        // eslint-disable-next-line prefer-const
    const [position, setPosition] = useState(1);
        // eslint-disable-next-line prefer-const
    let [messagee, setMessage] = useState("");
    

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowWidget(true);
    }
    const handleSave = () => {
        if (!events[eventName]) {
            events[eventName] = [];
        }
        
        // Check if position or points already exists for this event
        const positionExists = events[eventName].some(event => event.position === position);
        const pointsExists = events[eventName].some(event => event.points === points);

        if (positionExists || pointsExists) {
            setMessage("Error: Position or points already assigned to another house");
            return;
        }

        if (events[eventName].length === 3) {
            setMessage(`All houses recorded, updating for ${HOUSES[currentHouse]}`);
            events[eventName] = events[eventName].filter((event) => event.house !== HOUSES[currentHouse]);
            events[eventName].push({
                name: eventName,
                position: position,
                points: points,
                date: new Date(),
                house: HOUSES[currentHouse]
            });
        } else {
            events[eventName].push({
                name: eventName,
                position: position, 
                points: points,
                date: new Date(),
                house: HOUSES[currentHouse]
            });
            setMessage("Event Saved");
            handleHouseClick();
        }
        HOUSES = HOUSES.filter(house => house !== HOUSES[currentHouse]);
        
    }

    const handleHouseClick = () => {
        setCurrentHouse((prev) => (prev + 1) % HOUSES.length);
        setMessage("Save");
    }
    const setPointsLimited = (number: number) => {
      setPoints(number);
    }
    const setPositionLimited = (number: number) => {
        if (number > 4 || number == 0) {
            setPosition(1);
        } else {
            setPosition(number);
        }
    }
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb'
        }}>
          
            {!showWidget ? (
                <div style={{
                    maxWidth: '28rem',
                    width: '100%',
                    padding: '2rem',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    marginBottom: '2rem'
                }}>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#111827'
                    }}>Enter Event</h1>
                    <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <input
                                type="text"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                placeholder="Event Name"
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '0.375rem',
                                    outline: 'none'
                                }}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                borderRadius: '0.375rem',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            Submit
                        </button>
                    </form>
                </div>
            ) : (
                <div style={{
                    maxWidth: '28rem',
                    width: '100%',
                    padding: '2rem',
                    backgroundColor: 'white',
                    borderRadius: '0.5rem',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                    marginBottom: '1rem'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Event: {eventName}</h2>
                    <div 
                        onClick={() => {handleHouseClick(); setMessage("Save");}}
                        style={{
                            cursor: 'pointer',
                            padding: '1rem',
                            backgroundColor: HOUSE_COLORS[HOUSES[currentHouse] as keyof typeof HOUSE_COLORS],
                            borderRadius: '0.5rem',
                            marginBottom: '1.5rem',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '1.1rem',
                            textAlign: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                           
                        }}
                    >
                        {HOUSES[currentHouse]}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ marginRight: '0.5rem' }}>Points:</span>
                        <input
                            type="number"
                            value={points}
                            onChange={e => setPointsLimited(Number(e.target.value))}
                            style={{
                                width: '5rem',
                                padding: '0.25rem 0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ marginRight: '0.5rem' }}>Position:</span>
                        <input
                            type="number"
                            value={position}
                            onChange={e => setPositionLimited(Number(e.target.value))}
                            style={{
                                width: '5rem',
                                padding: '0.25rem 0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '0.375rem'
                            }}
                            min="1"
                        />
                    </div>
                    <div>   
                        <button
                            type="submit"
                            onClick={handleSave}
                            style={{
                                width: '100%',
                                padding: '0.5rem 1rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                borderRadius: '0.375rem',
                                border: 'none',
                                cursor: 'pointer',
                                marginTop: '1rem'
                            }}
                        >
                            {messagee}
                        </button>
                    </div>
                    
                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Existing Entries:</h3>
                        {events[eventName]?.map((event, index) => (
                            <EventCard 
                                key={index}
                                name={event.house}
                                position={event.position}
                                points={event.points}
                                date={event.date}
                                color={HOUSE_COLORS[event.house as keyof typeof HOUSE_COLORS]}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}