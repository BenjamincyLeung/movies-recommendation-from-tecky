import { MovieDetailService } from "../services/moviedetailService";
import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { CategoryWithFilms } from "../services/model";

export class MovieDetailController {
  constructor(private readonly MovieDetailService: MovieDetailService) {}

  //SECTION  GET MOVIE FOR MOVIE_DETAIL HTML
  getMovie = async (req: Request, res: Response) => {
    console.log("Hello this is getMovie controller ");
    const movieFid = parseInt(req.params["fid"]);
    const result = await this.MovieDetailService.getMovie(movieFid);
    res.status(200).json(result);
  };
  //SECTION A 1.0 GET CATEGORY_ID
  getCategoryID = async (req: Request, res: Response) => {
    const result = await this.MovieDetailService.selectCategoryID();
    res.status(200).json(result);
    return result;
  };
  //SECTION B 1.1 INSERT CATEGORY_ID & USER_ID
  postCategoryID = async (req: Request, res: Response) => {
    const category_idArray = req.body;

    console.log("This is ", category_idArray);
    const result = await this.MovieDetailService.insertCategoryID(category_idArray);

    res.status(200).json(result);
    return result;
  };

  // SECTION C 1.0: select nor more than 8 latest movies by 3 categories in home.html
  // each film will only appear in one category
  getLatestCategoryMovies = async (req: Request, res: Response) => {
    try {
      //the categories chosen by the log-in user
      const userId = req.session["user"].id;
      logger.debug(`Step C1 - request session: ${userId}`);

      const rows = await this.MovieDetailService.selectFiveLatestCategoryMovies(userId);
      logger.debug(`Step C2 - Categories of movie: ${JSON.stringify(rows)}`);

      const selectedCategorySet = new Set();
      for (const row of rows) {
        selectedCategorySet.add(row.category);
      }
      logger.debug(`Step C3 - 3 categories: ${Array.from(selectedCategorySet)}`);

      // const fifteenMovieNamesSet = new Set();

      const firstCategory = Array.from(selectedCategorySet)[0];
      const secondCategory = Array.from(selectedCategorySet)[1];
      const thirdCategory = Array.from(selectedCategorySet)[2];

      const firstCategoryFilmsResult: CategoryWithFilms[] = [];
      const secondCategoryFilmsResult: CategoryWithFilms[] = [];
      const thirdCategoryFilmsResult: CategoryWithFilms[] = [];

      for (let i = 0; i < rows.length; i++) {
        // const fifteenMovieNamesSetArr = Array.from(fifteenMovieNamesSet);

        if (rows[i].category == firstCategory && firstCategoryFilmsResult.length < 8) {
          firstCategoryFilmsResult.push(rows[i]);
          logger.debug(
            `Step C4 - ${i} loop, ${firstCategoryFilmsResult.length} length, firstCategory: ${rows[i].category},film: ${rows[i].film_name}`
          );
        }

        // push secondary category films without duplicate

        if (rows[i].category == secondCategory && secondCategoryFilmsResult.length < 8) {
          const checkExist = firstCategoryFilmsResult.findIndex(
            (filmName) => filmName.film_name === rows[i].film_name
          );

          if (checkExist == -1) {
            secondCategoryFilmsResult.push(rows[i]);
            logger.debug(
              `Step C4 - ${i} loop, ${secondCategoryFilmsResult.length} length, secondCategory: ${rows[i].category},film: ${rows[i].film_name}`
            );
          }
        }

        // push third category films without duplicate

        if (rows[i].category == thirdCategory && thirdCategoryFilmsResult.length < 8) {
          const checkExist = secondCategoryFilmsResult.findIndex(
            (filmName) => filmName.film_name === rows[i].film_name
          );

          if (checkExist == -1) {
            thirdCategoryFilmsResult.push(rows[i]);
            logger.debug(
              `Step C4 - ${i} loop, ${thirdCategoryFilmsResult.length} length, thirdCategory: ${rows[i].category},film: ${rows[i].film_name}`
            );
          }
        }
      }

      res.json({ firstCategoryFilmsResult, secondCategoryFilmsResult, thirdCategoryFilmsResult });
    } catch (err) {
      logger.debug(err.message);
      res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
  };

  // SECTION C 1.1: select all movies by each categories in genre.html
  getAllCategoryMovies = async (req: Request, res: Response) => {
    try {
      const chooseCat = parseInt(req.params.cid, 10);
      //...
      const movie = await this.MovieDetailService.selectCategoryMovies(chooseCat);

      res.json(movie);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
    //...
  };
  // SECTION D: Insert Rating
  postRating = async (req: Request, res: Response) => {
    try {
      const userId = req.session["user"]["id"];
      const result = await this.MovieDetailService.insertRating(
        userId,
        req.body.film_id,
        req.body.rating
      );
      if (typeof result == "number") {
        res.status(401).json(result);
        return;
      }
      res.status(200).json({ message: "successful" });
      return;
    } catch (e) {
      console.log(e);
      res.status(404).json({ message: "not successful" });
    }
  };

  //SECTION E: ADD-TO-COLLECTION TABLE
  addToCollection = async (req: Request, res: Response) => {
    try {
      const userId = req.session["user"]["id"];
      const result = await this.MovieDetailService.addToCollection(userId, req.body.film_id);
      if (result == "false") {
        res.status(400).json({ Message: "The film is in the List" });
        return;
      }
      res.status(200).json(result);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
  };

  //SECTION E: GET COLLECTION TABLE DETAILS FOR MY-LIST HTML
  getMyMovie = async (req: Request, res: Response) => {
    try {
      const userId = req.session["user"]["id"]; //integer
      const result = await this.MovieDetailService.getMyMovie(userId);
      res.status(200).json(result);
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
  };

  //SECTION E 1.1: DELETE A MOVIE COLLECTION TABLE
  deleteMyMovie = async (req: Request, res: Response) => {
    try {
      const parseCid = parseInt(req.params.id);
      const userId = req.session["user"]["id"];
      const result = await this.MovieDetailService.deleteMyMovie(userId, parseCid);
      res.status(200).json(result);
    } catch (e) {
      res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
  };

  //CLASS ENDS
}
