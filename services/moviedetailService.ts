import { Knex } from "knex";
// // import { user } from "./model";

export class MovieDetailService {
  constructor(private knex: Knex) {}

  //SECTION A GET MOVIE FOR MOVIE_DETAIL HTML
  getMovie = async (fid: number) => {
    const fidInformation = await this.knex.select("*").from("films").where("id", `${fid}`);
    return fidInformation;
  };

  selectCategoryID = async () => {
    const result = await this.knex.select("*").from("categories");

    return result;
  };

  //SECTION B 1.1 INSERT CATEGORY_ID & USER_ID
  insertCategoryID = async (category_idArray: Array<object>) => {
    const message = "This is: insertCategoryID";
    for (let i of category_idArray) {
      await this.knex
        .insert({
          user_id: `${i["id"]}`,
          categoriy_id: `${i["category"]}`,
        })
        .into("choose3categories");
    }
    return message;
  };

  // SECTION C: select movies by categories in home.html and genre.html
  selectFiveLatestCategoryMovies = async (userId: number) => {
    const result = await this.knex.raw(
      /*sql */
      `select choose3categories.user_id, films.id, films.film_name, categories.category, films.film_name, films.image,films.release_date from film_categories
      left join categories on category_id = categories.id
      left join films on film_id = films.id
      right join choose3categories on category_id = choose3categories.categoriy_id
      where choose3categories.user_id = ${userId}
      order by category, release_date DESC;`
    );
    return result.rows;
  };

  selectCategoryMovies = async (chooseCat: number) => {
    const movie = await this.knex.raw(/*sql */ `SELECT 
    films.id,
    films.film_name,
    films.image,
    categories.category,
    categories.id,
    film_categories.film_id,
    film_categories.category_id
    FROM films
    JOIN film_categories
    ON films.id = film_categories.film_id
    JOIN categories
    ON film_categories.category_id = categories.id
    where categories.id = ${chooseCat}`);
    return movie.rows;
  };

  // SECTION D: Insert Rating
  insertRating = async (userId: number, filmID: number, score: number) => {
    const checkIfUserHasRating = (
      await this.knex.raw(
        `SELECT rating FROM ratings WHERE user_id =${userId} and film_id =${filmID}`
      )
    ).rows[0];

    if (checkIfUserHasRating) {
      const existingRating = checkIfUserHasRating["rating"];
      return existingRating;
    }

    const result = this.knex
      .insert({
        user_id: `${userId}`,
        film_id: `${filmID}`,
        rating: `${score * 2}`,
      })
      .returning("id")
      .into("ratings");

    return result;
  };

  //SECTION E: ADD-TO-COLLECTION TABLE
  addToCollection = async (userId: number, filmID: number) => {
    const checkFilmExist = (
      await this.knex.raw(`
    select * 
     from collection
    where saved_user_id=${userId} and film_id=${filmID}
    `)
    ).rows[0];
    if (checkFilmExist) {
      return "false";
    }

    const result = this.knex
      .insert({
        saved_user_id: `${userId}`,
        film_id: `${filmID}`,
      })
      .returning("id")
      .into("collection");
    return result;
  };
  //SECTION E: GET COLLECTION TABLE DETAILS
  getMyMovie = async (userId: number) => {
    const result = (
      await this.knex.raw(`
    select * 
     from films
     join collection on film_id =films.id
     where saved_user_id=${userId}
    `)
    ).rows;

    return result;
  };
  //SECTION E 1.1: DELETE A MOVIE COLLECTION TABLE
  deleteMyMovie = async (userId: number, cid: number) => {
    const result = await this.knex.raw(`
    DELETE  
     from collection 
     where id =${cid} and  
      saved_user_id=${userId}
    `);

    return result;
  };

  //CLASS ENDS
}
