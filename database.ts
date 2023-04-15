import { MongoClient, MongoClientOptions } from 'mongodb';

const uri = 'mongodb://localhost:27017/testdb';

export async function connectToDatabase() {
const options: MongoClientOptions = {};
const client = new MongoClient(uri, options);
try {
await client.connect();
console.log('Database connected');
return client.db(); // return the database instance
} catch (err) {
console.error(err);
process.exit(1); // exit the process if there's an error connecting to the database
}
}

