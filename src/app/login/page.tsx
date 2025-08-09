"use client";
import { useState, type FormEvent } from "react";
import { addEventAction } from "./actions";
import { useRouter } from "next/navigation";

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

export default function EventEntry() {
    const [eventName, setEventName] = useState("");
    const [lionPoints, setLionPoints] = useState("");
    const [tigerPoints, setTigerPoints] = useState("");
    const [pantherPoints, setPantherPoints] = useState("");
    const [leopardPoints, setLeopardPoints] = useState("");
    const [pass, setPass] = useState("");
    const [disabled, setDisabled] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        if (pass != "verysecurepassword") {
            alert("Unauthorized!");
        }
        e.preventDefault();
        const promises = [];
        let pointsMap = [
            { name: "Lions", points: lionPoints },
            { name: "Tigers", points: tigerPoints },
            { name: "Panthers", points: pantherPoints },
            { name: "Leopards", points: leopardPoints },
        ];

        pointsMap.sort((a, b) => Number(b.points) - Number(a.points));
        let pos = 1
        for (const house of pointsMap) {
            promises.push(addEventAction(house.name, eventName, Number(house.points),pos));
            pos++
        }

        if (promises.length > 0) {
            setDisabled(true);
            await Promise.all(promises);
            router.push('/');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb'
        }}>
            <form onSubmit={handleSubmit} style={{marginTop: '2rem'}}>
                <div style={{marginBottom: '1.5rem'}}>// shitty auth go br
                    <input
                        type="text"
                        value={pass}
                        onChange={(e) => setPass(e.target.value)}
                        placeholder="pass"
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
                <div style={{marginBottom: '1.5rem'}}>
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
                <div style={{marginBottom: '1.5rem'}}>
                    <input
                        type="number"
                        value={lionPoints}
                        onChange={(e) => setLionPoints(e.target.value)}
                        placeholder="Lion Points"
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
                <div style={{marginBottom: '1.5rem'}}>
                    <input
                        type="number"
                        value={tigerPoints}
                        onChange={(e) => setTigerPoints(e.target.value)}
                        placeholder="Tiger Points"
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
                <div style={{marginBottom: '1.5rem'}}>
                    <input
                        type="number"
                        value={leopardPoints}
                        onChange={(e) => setLeopardPoints(e.target.value)}
                        placeholder="Leopard Points"
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
                <div style={{marginBottom: '1.5rem'}}>
                    <input
                        type="number"
                        value={pantherPoints}
                        onChange={(e) => setPantherPoints(e.target.value)}
                        placeholder="Panther Points"
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
                    disabled={disabled}
                >
                    Submit
                </button>
            </form>
        </div>)
}