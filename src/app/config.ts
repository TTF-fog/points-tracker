import dotenv from 'dotenv';
dotenv.config();
interface Config {
    mongodb: {
        uri: string;
        collection: string;
    }
}
const config: Config = {
    mongodb:{
        uri: process.env.MONGODB_URI || '',
        collection: process.env.MONGODB_COLLECTION || '',
    }
};
export default config;