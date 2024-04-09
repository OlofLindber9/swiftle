var express = require('express'),
    path = require('path'),
    bodyparser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    app = express();


const client = require('./db');



// Assign Dust Engine To .dust Files
app.engine('dust', cons.dust);

// set Default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser Middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded( {extended: false}));

const cors = require('cors');
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = ['http://90.224.206.14:81', 'http://localhost:5500', 'http://127.0.0.1:5500', 'http://192.168.0.155:5500'];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy violation'));
        }
    },
}));


app.get('/', function(req, res){
    res.render('index');
});

// Server
app.listen(5500, function(){
    console.log('Server Started On Port 5500');
});


//get songs
app.get('/api/songs', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM songs');
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});


//get song name
app.get('/api/name', async (req, res) => {      //changed Name to name maybe not working
    const songName = req.query.name;
    try {
        const result = await client.query('SELECT name FROM songs WHERE name = $1', [songName]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});


//get song album
app.get('/api/album', async (req, res) => {
    const songName = req.query.name;
    try {
        const result = await client.query('SELECT album FROM songs WHERE name = $1', [songName]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});

//get song tracknumber
app.get('/api/tracknumber', async (req, res) => {
    const songName = req.query.name;
    try {
        const result = await client.query('SELECT tracknumber FROM songs WHERE name = $1', [songName]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});

//get song length
app.get('/api/length', async (req, res) => {
    const songName = req.query.name;
    try {
        const result = await client.query('SELECT length FROM songs WHERE name = $1', [songName]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});

//get song features
app.get('/api/streams', async (req, res) => {
    const songName = req.query.name;
    try {
        const result = await client.query('SELECT streams FROM songs WHERE name = $1', [songName]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});

//Count songs from a string
app.get('/api/count', async (req, res) => {
    const searchString = req.query.q;
    try {
        const query = 'SELECT COUNT(*) FROM songs WHERE name LIKE $1';
        const values = [`%${searchString}%`];

        const result = await client.query(query, values);
        res.json({ count: parseInt(result.rows[0].count, 10) });
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});


app.get('/api/suggestions', async (req, res) => {
    const partialName = req.query.partial;
    try {
        // Use ILIKE for case-insensitive matching
        const query = 'SELECT name FROM songs WHERE name ILIKE $1';
        const values = [`%${partialName}%`];

        const result = await client.query(query, values);
        res.json(result.rows.map(row => row.name));
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});

// Get all song data from a song
app.get('/api/songdata', async (req, res) => {
    const songName = req.query.name;
    try {
        const query = 'SELECT * FROM songs WHERE name LIKE $1';
        const values = [songName];

        const result = await client.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});

// Get correct song from ID
app.get('/api/correctSong', async (req, res) => {
    const songID = req.query.id;
    try {
        const query = 'SELECT song FROM correctsongs WHERE id = $1';
        const values = [songID];

        const result = await client.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error('Error executing query', err.stack);
        res.status(500).send('Error fetching data');
    }
});

module.exports = app;