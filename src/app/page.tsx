import { dbConnect } from "@/db";
import { getAllHouses, getAllEvents, getEventsByHouse } from "@/db_utils/manager";
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
    }>;
}

interface Event {
    name: string;
    position: number;
    points: number;
    color: string;
}

export const revalidate = 300; 
export default async function Home() {
    try {
        await dbConnect();
        
        const [houses, lion_events, tiger_events, panther_events, leopard_events] = await Promise.all([
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
                points: event.points
            }))
        }));
    
        let serializedEvents = [];
        const serializedLionEvents = lion_events?.map((event: { name: any; position: any; points: any; }) => ({
            name: event.name,
            position: event.position,
            points: event.points,
            color: "yellow"
        }));
        const serializedTigerEvents = tiger_events?.map((event: { name: any; position: any; points: any; }) => ({
            name: event.name,
            position: event.position,
            points: event.points,
            color: "red"
        }));
        const serializedPantherEvents = panther_events?.map((event: { name: any; position: any; points: any; }) => ({
            name: event.name,
            position: event.position,
            points: event.points,
            color: "blue"
        }));
        const serializedLeopardEvents = leopard_events?.map((event: { name: any; position: any; points: any; }) => ({
            name: event.name,
            position: event.position,
            points: event.points,
            color: "green"
        }));
        serializedEvents.push(serializedLionEvents);
        serializedEvents.push(serializedTigerEvents);
        serializedEvents.push(serializedPantherEvents);
        serializedEvents.push(serializedLeopardEvents);

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
