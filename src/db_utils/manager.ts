import { House } from './models';
import { Types } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
interface EventData {
    name: string;
    position: number;
    points: number;
    date: Date;
}

interface EventUpdateData {
    name?: string;
    position?: number;
    points?: number;
}
export const updateHousePointsByHouseName = async (houseName: string, points: number) => {
    try {
        const house = await House.findOne({ name: houseName });
        house.points = points;
        await house.save();
        if (!house) {
            throw new Error('House not found');
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to update house points: ${error.message}`);
        }
        throw new Error('Failed to update house points: Unknown error');
    }
};

export const createHouse = async (name: string) => {
    try {
        if (await House.findOne({ name })) {
            return null;
        }
        const house = new House({ name });
        return await house.save();
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to create house: ${error.message}`);
        }
        throw new Error('Failed to create house: Unknown error');
    }
};

export const getAllHouses = async () => {
    try {
        return await House.find({});
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch houses: ${error.message}`);
        }
        throw new Error('Failed to fetch houses: Unknown error');
    }
};

export const getHouseByName = async (id: string) => {
    try {
        const house = await House.findOne({ name: id });
        if (!house) {
            return null;
        }
        return house;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch house: ${error.message}`);
        }
        throw new Error('Failed to fetch house: Unknown error');
    }
};


export const updateHousePoints = async (id: string, points: number) => {
    try {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error('Invalid house ID');
        }
        return await House.findByIdAndUpdate(
            id,
            { $set: { points } },
            { new: true }
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to update house points: ${error.message}`);
        }
        throw new Error('Failed to update house points: Unknown error');
    }
};


export const addEvent = async (
    houseId: string,
    eventData: EventData,
 
) => {
    try {
       
        return await House.findOneAndUpdate(
            { name: houseId },
            { $push: { events: { ...eventData } } },
            { new: true }
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to add event: ${error.message}`);
        }
        throw new Error('Failed to add event: Unknown error');
    }
};
export const addEventByHouseName = async (
    houseName: string,
    eventData: EventData,
 
) => {
    try {
       
        return await House.findOneAndUpdate(
            { name: houseName },
            { $push: { events: { ...eventData } } },
            { new: true }
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to add event: ${error.message}`);
        }
        throw new Error('Failed to add event: Unknown error');
    }
};

export const getAllEvents = async () => {
    try {
        const houses = await House.find({}).select('events');
        // Flatten the events array from all houses
        const allEvents = houses.flatMap(house => house.events);
        return allEvents;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch events: ${error.message}`);
        }
        throw new Error('Failed to fetch events: Unknown error');
    }
};

export const getEventsByHouse = async (house_name: string) => {
    try {
        const house = await House.findOne({ name: house_name }).select('events');
        return house?.events;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to fetch events: ${error.message}`);
        }
        throw new Error('Failed to fetch events: Unknown error');
    }
};
// Update an event in a house
export const updateEvent = async (
    houseId: string,
    eventId: string,
    eventData: EventUpdateData
) => {
    try {
        if (!Types.ObjectId.isValid(houseId)) {
            throw new Error('Invalid house ID');
        }
        
        const updateQuery: Record<string, any> = {};
        Object.keys(eventData).forEach(key => {
            updateQuery[`events.$.${key}`] = eventData[key as keyof EventUpdateData];
        });

        return await House.findOneAndUpdate(
            { _id: houseId, 'events._id': eventId },
            { $set: updateQuery },
            { new: true }
        );
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to update event: ${error.message}`);
        }
        throw new Error('Failed to update event: Unknown error');
    }
};

// Delete a house
export const deleteHouse = async (id: string) => {
    try {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error('Invalid house ID');
        }
        return await House.findByIdAndDelete(id);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Failed to delete house: ${error.message}`);
        }
        throw new Error('Failed to delete house: Unknown error');
    }
};
