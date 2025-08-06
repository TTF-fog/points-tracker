import { model, models, Schema } from "mongoose";

const EventSchema: Schema = new Schema({
    name: { type: String, required: true },
    position: { type: Number, required: true },
    points: { type: Number, required: true },
    date: { type: Date, required: true }
}, {
    _id: false
});

const HouseSchema: Schema = new Schema({
    name: { type: String, required: true },
    points: { type: Number, default: 0 },
    events: [EventSchema]
}, {
    versionKey: false
});

export const House = models.House || model("House", HouseSchema);