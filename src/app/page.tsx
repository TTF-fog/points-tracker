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
        await dbConnect();
        for (let i = 0; i < 10; i++) {
            addEventByHouseName("Lions",{name: "Test Event", position: 1, points: 100, date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))});
            addEventByHouseName("Tigers",{name: "Test Event", position: 1, points: 100, date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))});
            addEventByHouseName("Panthers",{name: "Test Event", position: 1, points: 100, date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))});
            addEventByHouseName("Leopards",{name: "Test Event", position: 1, points: 100, date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))});
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
