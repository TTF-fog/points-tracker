import dotenv from 'dotenv';
dotenv.config();
interface Config {
    mongodb: {
        uri: string;
        collection: string;
    }
}
console.log(process.env.prod);
if (process.env.prod == "false" || process.env.prod == undefined){
    console.log("Local Mode");
    //@ts-ignore
    var config: Config = {
        mongodb:{
            uri: process.env.LOCAL_MONGODB_URI || '',
            collection: process.env.MONGODB_COLLECTION || '',
        }
    };
}else{
    console.log("Production Mode");
    //@ts-ignore
    var config: Config = {
        mongodb:{
            uri: process.env.PROD_MONGODB_URI || '',
            collection: process.env.MONGODB_COLLECTION || '',
        }
    };
}
export default config;