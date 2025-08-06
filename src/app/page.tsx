import { dbConnect } from "@/db";
import { getAllHouses, getAllEvents, getEventsByHouse, addEventByHouseName } from "@/db_utils/manager";
import ClientPage from "@/app/components/ClientPage";
import { get } from "http";

interface House {
    _id: any;
    name: string;
    points: number;
    events: Array<{
        name: string;
        position: number;
        points: number;
        date: Date;
    }>;
}

interface Event {
    name: string;
    position: number;
    points: number;
    date: Date;
    color: string;
}

export const revalidate = 300; // Revalidate every 5 minutes (300 seconds)

export default async function Home() {
    try {
        let events: Event[] = [
            {
                name: "Track Meet",
                position: 1,
                points: 150,
                date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
                color: "yellow"
            },
            {
                name: "Math Olympiad", 
                position: 2,
                points: 100,
                date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
                color: "red"
            },
            {
                name: "Science Fair",
                position: 3, 
                points: 75,
                date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
                color: "blue"
            },
            {
                name: "Debate Tournament",
                position: 1,
                points: 125,
                date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
                color: "green"
            },
            {
                name: "Chess Championship",
                position: 2,
                points: 200,
                date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
                color: "yellow"
            },
            {
                name: "Art Exhibition",
                position: 3,
                points: 100,
                date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
                color: "red"
            },
            {
                name: "Swimming Gala",
                position: 1,
                points: 175,
                date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
                color: "blue"
            },
            {
                name: "Robotics Contest",
                position: 2,
                points: 150,
                date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
                color: "green"
            },
            {
                name: "Music Festival",
                position: 3,
                points: 125,
                date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
                color: "yellow"
            },
            {
                name: "Public Speaking",
                position: 1,
                points: 100,
                date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
                color: "red"
            }
        ];
        await dbConnect();
        for (let i = 0; i < 10; i++) {
            let date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
            addEventByHouseName("Lions",{name: events[i].name, position: 1, points: 250, date: date});
            addEventByHouseName("Tigers",{name: events[i].name, position: 2, points: 200, date: date});
            addEventByHouseName("Panthers",{name: events[i].name, position: 3, points: 150, date: date});
            addEventByHouseName("Leopards",{name: events[i].name, position: 4, points: 100, date: date});
        }
        const [houses,lion_events, tiger_events, panther_events, leopard_events] = await Promise.all([
            getAllHouses(),
            getEventsByHouse("Lions"),
            getEventsByHouse("Tigers"),
            getEventsByHouse("Panthers"),
            getEventsByHouse("Leopards")
        ]);
        
 
        const serializedHouses = houses.map((house: House) => ({
            _id: house._id.toString(),
            name: house.name,
            points: house.points,
            events: house.events.map(event => ({
                name: event.name,
                position: event.position,
                points: event.points,
                date: event.date
            }))
        }));
        
        let serializedEvents = [];
        const serializedLionEvents = lion_events?.map((event: { name: any; position: any; points: any; date: any; }) => ({
            name: event.name,
            position: event.position,
            points: event.points,
            color: "yellow",
            date: event.date
        }));
        console.log(serializedLionEvents);
        
        const serializedTigerEvents = tiger_events?.map((event: { name: any; position: any; points: any; date: any; }) => ({
            name: event.name,
            position: event.position,
            points: event.points,
            color: "red",
            date: event.date
        }));
        const serializedPantherEvents = panther_events?.map((event: { name: any; position: any; points: any; date: any; }) => ({
            name: event.name,
            position: event.position,
            points: event.points,
            color: "blue",
            date: event.date
        }));
        const serializedLeopardEvents = leopard_events?.map((event: { name: any; position: any; points: any; date: any; }) => ({
            name: event.name,
            position: event.position,
            points: event.points,
            color: "green",
            date: event.date
        }));
        
        serializedEvents.push(serializedLionEvents);
        serializedEvents.push(serializedTigerEvents);
        serializedEvents.push(serializedPantherEvents);
        serializedEvents.push(serializedLeopardEvents);
       
        serializedEvents = serializedEvents
            .flatMap(events => events || [])
            .map((event) => ({
                name: event.name,
                position: event.position,
                points: event.points,
                date: event.date,
                color: event.color
            }))
            .sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateB.getTime() - dateA.getTime();
            });

        return <ClientPage 
            initialHouses={serializedHouses} 
            initialEvents={serializedEvents} 
            Lion_Events={serializedLionEvents}
            Tiger_Events={serializedTigerEvents}
            Panther_Events={serializedPantherEvents}
            Leopard_Events={serializedLeopardEvents}
        />;
    } catch (error) {
        console.error("Error in Home component:", error);
        return (
            <div>
                <h1>Error Loading Data</h1>
                <p>Please try refreshing the page.</p>
            </div>
        );
    }
}
