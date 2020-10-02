import express from 'express';
const app = express();
import { home } from './routes/home';
import { addSong } from './routes/rest';
import { Database } from './database/database';
// @ts-expect-error
import { port, route } from './settings.js';

// Connect to the database
const db: Database = new Database();
db.connect();

// Routes
app.get(route, home);
app.put(`${route}song`, addSong);


// Express things
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, going offline');
    db.disconnect();    
})