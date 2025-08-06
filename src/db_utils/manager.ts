import { House } from './models';
import { Types } from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
interface EventData {
    name: string;
    position: number;
    points: number;
}

interface EventUpdateData {
    name?: string;
    position?: number;
    points?: number;
}

export const createHouse = async (name: string) => {
    try {
        if (await House.findOne({ name })) {
            return null;
        }
        const house = new House({ name });
        return await house.save();
    } catch (error: any) {
        throw new Error(`Failed to create house: ${error.message}`);
    }
};

export const getAllHouses = async () => {
    try {
        return await House.find({});
    } catch (error: any) {
        throw new Error(`Failed to fetch houses: ${error.message}`);
    }
};

export const getHouseByName = async (id: string) => {
    try {
        const house = await House.findOne({ name: id });
        if (!house) {
            return null;
        }
        return house;
    } catch (error: any) {
        throw new Error(`Failed to fetch house: ${error.message}`);
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
    } catch (error: any) {
        throw new Error(`Failed to update house points: ${error.message}`);
    }
};


export const addEvent = async (
    houseId: string,
    eventData: EventData
) => {
    try {
       
        return await House.findOneAndUpdate(
            { name: houseId },
            { $push: { events: eventData } },
            { new: true }
        );
    } catch (error: any) {
        throw new Error(`Failed to add event: ${error.message}`);
    }
};

export const getAllEvents = async () => {
    try {
        const houses = await House.find({}).select('events');
        // Flatten the events array from all houses
        const allEvents = houses.flatMap(house => house.events);
        return allEvents;
    } catch (error: any) {
        throw new Error(`Failed to fetch events: ${error.message}`);
    }
};

export const getEventsByHouse = async (house_name: string) => {
    try {
        const house = await House.findOne({ name: house_name }).select('events');
        return house?.events;
    } catch (error: any) {
        throw new Error(`Failed to fetch events: ${error.message}`);
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
    } catch (error: any) {
        throw new Error(`Failed to update event: ${error.message}`);
    }
};

// Delete a house
export const deleteHouse = async (id: string) => {
    try {
        if (!Types.ObjectId.isValid(id)) {
            throw new Error('Invalid house ID');
        }
        return await House.findByIdAndDelete(id);
    } catch (error: any) {
        throw new Error(`Failed to delete house: ${error.message}`);
    }
};

