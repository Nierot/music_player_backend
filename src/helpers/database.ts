import * as Mongoose from 'mongoose';
// @ts-expect-error
import { mongo } from '../settings.js';

class Database {

    db: Mongoose.Connection;

    connect() {
        if (this.db) return
        console.log('Connecting to the database...');

        Mongoose.connect(mongo, {
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        this.db = Mongoose.connection;

        this.db.once('open', async () => console.log('Connected to the database'));

        this.db.once('error', () => {
            console.error('Cannot connect to the database');
            process.exit(1);
        });
    }

    disconnect() {
        if (!this.db) return

        Mongoose.disconnect();
    }
}

export { Database }