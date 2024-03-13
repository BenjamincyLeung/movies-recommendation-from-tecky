import express from "express";
import { movieDetailController } from "../server";
import { flaskRecommendationController } from "../server";
export const moveDetailRoutes = express.Router();
// SECTION A: Get a single movie detail in movieDetails.html
moveDetailRoutes.post("/detail/:fid", movieDetailController.getMovie);

// SECTION B: Operation of user's categories preferences
moveDetailRoutes.get("/categories", movieDetailController.getCategoryID);
moveDetailRoutes.post("/categories", movieDetailController.postCategoryID);

// SECTION C: Filtering of movies by category
moveDetailRoutes.get("/categoryWithMovies", movieDetailController.getLatestCategoryMovies);
moveDetailRoutes.get("/categoryWithMovies/:cid", movieDetailController.getAllCategoryMovies);

// SECTION D: Insert Rating
moveDetailRoutes.post("/rating", movieDetailController.postRating);

// SECTION E: ADD TO WATCH-LIST AND GET DATA FROM COLLECTION TABLE
moveDetailRoutes.post("/WatchRecordRoutes", movieDetailController.addToCollection);
moveDetailRoutes.get("/WatchRecordRoutes", movieDetailController.getMyMovie);
moveDetailRoutes.delete("/WatchRecordRoutes/:id", movieDetailController.deleteMyMovie);

// SECTION F: movie recommendation by flask; fetch with python
moveDetailRoutes.get("/recommendation/:fid", flaskRecommendationController.getRecommendationMovies);
