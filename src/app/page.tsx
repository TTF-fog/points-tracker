import { dbConnect } from "@/db";
import { getAllHouses, getAllEvents, getEventsByHouse, addEventByHouseName, updateHousePoints, updateHousePointsByHouseName } from "@/db_utils/manager";
import ClientPage from "@/app/components/ClientPage";
import { get } from "http";
import { unstable_cache } from 'next/cache';


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


const getCachedData = unstable_cache(
   
    async () => {
        console.log('Fetching fresh data at:', new Date().toISOString());
        const calculateSum = (arr: Event[]) => {
            return arr.reduce((total, current) => {
                return total + current.points;
            }, 0);
        }
        
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
           
            updateHousePointsByHouseName("Lions",calculateSum(serializedLionEvents));
            const serializedTigerEvents = tiger_events?.map((event: { name: any; position: any; points: any; date: any; }) => ({
                name: event.name,
                position: event.position,
                points: event.points,
                color: "red",
                date: event.date
            }));
            updateHousePointsByHouseName("Tigers",calculateSum(serializedTigerEvents));
            const serializedPantherEvents = panther_events?.map((event: { name: any; position: any; points: any; date: any; }) => ({
                name: event.name,
                position: event.position,
                points: event.points,
                color: "blue",
                date: event.date
            }));
            updateHousePointsByHouseName("Panthers",calculateSum(serializedPantherEvents));
            const serializedLeopardEvents = leopard_events?.map((event: { name: any; position: any; points: any; date: any; }) => ({
                name: event.name,
                position: event.position,
                points: event.points,
                color: "green",
                date: event.date
            }));
            updateHousePointsByHouseName("Leopards",calculateSum(serializedLeopardEvents));
            serializedEvents.push(serializedLionEvents, serializedTigerEvents, serializedPantherEvents, serializedLeopardEvents);
      

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

            return {
                houses: serializedHouses,
                events: serializedEvents,
                lionEvents: serializedLionEvents,
                tigerEvents: serializedTigerEvents,
                pantherEvents: serializedPantherEvents,
                leopardEvents: serializedLeopardEvents
            };
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    },
    ['all-data'],
    { revalidate: 10 }
);

export default async function Home() {
    try {
        const { houses, events: serializedEvents, lionEvents, tigerEvents, pantherEvents, leopardEvents } = await getCachedData();

        // Initialize sample events if needed
        const sampleEvents: Event[] = [
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
        getAllEvents().then((events) => {
            if (events.length == 0) {
                for (let i = 0; i < 10; i++) {
                    const date = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
                addEventByHouseName("Lions", { name: sampleEvents[i].name, position: 1, points: 250, date: date });
                addEventByHouseName("Tigers", { name: sampleEvents[i].name, position: 2, points: 200, date: date });
                addEventByHouseName("Panthers", { name: sampleEvents[i].name, position: 3, points: 150, date: date });
                addEventByHouseName("Leopards", { name: sampleEvents[i].name, position: 4, points: 100, date: date });
            }
        }
    })
        // Get cached data
 
        return <ClientPage 
            initialHouses={houses} 
            initialEvents={serializedEvents} 
            Lion_Events={lionEvents}
            Tiger_Events={tigerEvents}
            Panther_Events={pantherEvents}
            Leopard_Events={leopardEvents}
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
