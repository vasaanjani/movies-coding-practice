const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use = express.json();

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database,
        });
        app.listen(3000, () => {
            console.log("Server Running at http://localhost:3000/");
        });
    } catch (e) {
        console.log(`DB Error:${e.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();

//GET Method

app.get("/movies/", async (request, response) => {
    const getAllMovieNames = `
    SELECT 
    movie.movie_name
    FROM
    movie;`;

    const moviesAllNamesQuery = await db.all(getAllMovieNames);
    response.send(moviesAllNamesQuery);
});

//POST Method

app.post("/movies/", async (request, response) => {


    const { directorId, movieName, leadActor } = request.body;

    const addMovieQuery = `
 
 INSERT INTO movie(director_id,movie_name,lead_actor)
 VALUES(

    ${directorId},
    '${movieName}',
    '${leadActor}'
);`;

    const addMovieDetails = await db.run(addMovieQuery);

    response.send("Movie Successfully Added");
});

//GET Method

app.get("/movies/:movieId/", async (request, response) => {
    const { movieId } = request.params;

    const getMovieQuery = `
    
    SELECT 
    *
    FROM 
    movie
    WHERE movie_id = ${movieId};`;

    const movie = await db.get(getMovieQuery);
    response.send(movie);
});
