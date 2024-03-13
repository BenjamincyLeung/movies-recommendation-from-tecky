import express from "express";
import { moveDetailRoutes } from "./routers/movedetailRoutes";
import { userRoutes } from "./routers/userRouter";

export const routes = express.Router();

routes.use((req, res, next) => {
  console.log(`[DEBUG] request method: ${req.method} path: ${req.path}`);
  next();
});

routes.use("/user", userRoutes);
routes.use('/movie',moveDetailRoutes)
routes.get("test", (req, res) => {
  res.json({ message: "test" });
});
