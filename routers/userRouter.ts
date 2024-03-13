import express from "express";
import { userController } from "../server";

export const userRoutes = express.Router();

userRoutes.post('/signUp', userController.signUpNewUser);
userRoutes.post("/login", userController.login);
userRoutes.get("/login/google", userController.loginGoogle);
userRoutes.get("/logout", userController.logout);




