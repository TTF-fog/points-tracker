"use server"
import { addEventByHouseName } from "@/db_utils/manager";

export async function addEventAction(
    houseName: string,
    eventName: string,
    points: number,
    position: number
) {
    await addEventByHouseName(houseName, {
        name: eventName,
        position: position,
        points: points,
        date: new Date(),
    });
}