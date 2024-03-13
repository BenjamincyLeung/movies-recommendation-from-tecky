import jsonfile from "jsonfile";
import pg from "pg";
import dotenv from "dotenv";
import XLSX from "xlsx";
import {FilmsCategory, Genres, FilmsDesc, RatingsList} from "./services/model"
dotenv.config();

const client = new pg.Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
});

export const readJsonFilePromise = <T>(filepath: string) =>
    new Promise<T>((resolve, reject) => {
        jsonfile.readFile(filepath, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });

async function main() {

    await client.connect();
    await client.query(/*sql*/ `DELETE FROM film_Categories`);
    await client.query(/*sql*/ `DELETE FROM ratings`);
    await client.query(/*sql*/ `DELETE FROM categories`);
    await client.query(/*sql*/ `DELETE FROM films`);

    const categoryData = await readJsonFilePromise<FilmsCategory[]>("./data/categories.json");
    const filmData = await readJsonFilePromise<FilmsDesc[]>("./data/final_film.json");
    const ratingData = await readJsonFilePromise<RatingsList[]>("./data/rating.json");

    //============section A. import categories data============
    const workbook = XLSX.readFile("./data/Excel_movie_image.xlsx");
    const imdbWorkBook = workbook.Sheets["Worksheet"];
    const imagesSet: any = XLSX.utils.sheet_to_json(imdbWorkBook);
  for (let i=0; i<200; i++){
        filmData[i].poster_path=imagesSet[i].imdb_id
    }
    console.log("step A0 - post_path has been changed : ", filmData);
    const filmsMap = new Map<string, number>();
    for (const films of filmData) {
        console.log("step A1 - will insert: ", films.title, films.release_date);
        const sqlQuery = /*sql */
            `INSERT INTO films (film_name, image, adult, overview, release_date) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id`
        const filmId = (await client.query(sqlQuery,
            [films.title, films.poster_path, films.adult, films.overview, films.release_date]
        )).rows[0]
        console.log("step A2 - inserted: ", films.title, films.release_date);
        filmsMap.set(films.title, filmId.id)
    }
    console.log("Step A3 - film's id: ", filmsMap)


    //============section B. import categories data============
    const categoriesSet = new Set<string>();
    const categoriesMap = new Map<string, number>();

    for (let i = 0; i < categoryData.length; i++) {
        const rawGenres = categoryData[i].genres;
        const genresArray = eval(rawGenres);

        genresArray.forEach((genres: Genres) => {
            const genre = genres.name;
            console.log("step B1 - get each genre: ", genre);
            categoriesSet.add(genre);
        });
    }
    console.log("Step B2 - check category set", categoriesSet);
    const categoryArray: string[] = Array.from(categoriesSet);

    for (const category of categoryArray) {
        console.log("step B3 - will insert: ", category);
        const sqlQuery = /*sql */ `INSERT INTO categories (category) VALUES ('${category}') RETURNING id`;
        const categoryId = (await client.query(sqlQuery)).rows[0];
        categoriesMap.set(category, categoryId.id);
        console.log("step B4 - inserted: ", category);
    }
    console.log("step B5 - category's id: ", categoriesMap);


    //============section C. import film_Categories data============
    for (let i = 0; i < categoryData.length; i++) {
        const filmWithCategories: any = []
        const titleId: number | undefined = filmsMap.get(categoryData[i].title);
        const rawGenres: string = categoryData[i].genres;
        const genresArray: [] = eval(rawGenres);

        genresArray.forEach((genres: Genres) => {
            const genreId: number | undefined = categoriesMap.get(genres.name);
            const filmWithCategory = {
                name: titleId,
                category: genreId
            }
            filmWithCategories.push(filmWithCategory);


        });
        console.log("Step C1 - this is the: ", i, "loop(s), the film categories are: ", filmWithCategories)

        for (const filmWithCategory of filmWithCategories) {
            const sqlQuery = /*sql */ `INSERT INTO film_categories (film_id, category_id) VALUES ($1, $2)`;
            await client.query(sqlQuery, [filmWithCategory.name, filmWithCategory.category]);
        }
        console.log("Step C2 - this is the: ", i, "loop(s), inserted: ", filmWithCategories);
    }


    //============section D. import rating data============
    for (let i = 0; i < ratingData.length; i++) {
        const movieId: number | undefined = filmsMap.get(ratingData[i].title);
        const score = (ratingData[i].rating) * 2;

        console.log("Step D1 - this is the: ", i, "loop(s), the user_id is: ", ratingData[i].userId,
            " to movieId: ", movieId, ". The rate is scored: ", score);

        const sqlQuery = /*sql */
            `INSERT INTO ratings (user_id, film_id, rating) 
        VALUES ($1, $2, $3)`;
        await client.query(sqlQuery,
            [ratingData[i].userId, movieId, score]
        );
        console.log("finished inserted");
    }



    await client.end();
}

main();

