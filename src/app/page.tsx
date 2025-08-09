import { dbConnect } from "@/db";
import { getAllHouses, getAllEvents, getEventsByHouse, addEventByHouseName, updateHousePointsByHouseName } from "@/db_utils/manager";
import ClientPage from "@/app/components/ClientPage";

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
        const data_fetch_time = new Date().toLocaleString();
        console.log('Fetching fresh data at:', data_fetch_time);
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
            console.log("Updating points for Lions");
           
            updateHousePointsByHouseName("Lions",calculateSum(serializedLionEvents));
            const serializedTigerEvents = tiger_events?.map((event: { name: any; position: any; points: any; date: any; }) => ({
                name: event.name,
                position: event.position,
                points: event.points,
                color: "red",
                date: event.date
            }));
            console.log("Updating points for Tigers");
            updateHousePointsByHouseName("Tigers",calculateSum(serializedTigerEvents));
            const serializedPantherEvents = panther_events?.map((event: { name: any; position: any; points: any; date: any; }) => ({
                name: event.name,
                position: event.position,
                points: event.points,
                color: "blue",
                date: event.date
            }));
            console.log("Updating points for Panthers");
            updateHousePointsByHouseName("Panthers",calculateSum(serializedPantherEvents));
            const serializedLeopardEvents = leopard_events?.map((event: { name: any; position: any; points: any; date: any; }) => ({
                name: event.name,
                position: event.position,
                points: event.points,
                color: "green",
                date: event.date
            }));
            console.log("Updating points for Leopards");
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
                leopardEvents: serializedLeopardEvents,
                data_fetch_time: data_fetch_time
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
        const { houses, events: serializedEvents, lionEvents, tigerEvents, pantherEvents, leopardEvents, data_fetch_time  } = await getCachedData();
        await dbConnect();
        getAllEvents().then((events) => {
            if (events.length == 0) {
                return (
                    <div>
                        <h1>something went wrong </h1>
                        <h2>try reloading the page. if it continues to break mail me @</h2>
                    </div>
                )
            }
    })
        return (
            <ClientPage 
                initialHouses={houses} 
                initialEvents={serializedEvents} 
                Lion_Events={lionEvents}
                Tiger_Events={tigerEvents}
                Panther_Events={pantherEvents}
                Leopard_Events={leopardEvents}
                data_fetch_time={data_fetch_time}
        />
        
    )
    } catch (error) {
        console.error("Error in Home component:", error);
        return (
            <div>
                <h1>something went wrong </h1>
                <h2>try reloading the page. if it continues to break mail me @</h2>
            </div>
        );
    }
}
