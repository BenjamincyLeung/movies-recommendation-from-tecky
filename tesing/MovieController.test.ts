import { MovieDetailController } from "../controllers/moviedetailController";
import { MovieDetailService } from "../services/moviedetailService";
import type { Knex } from "knex";
import express from "express";
import { movieID } from "./models";

describe("UserController Test Case", () => {
  /*Scope*/
  let controller: MovieDetailController;
  let service: MovieDetailService;
  let req: express.Request;
  let res: express.Response;

  beforeEach(() => {
    service = new MovieDetailService({} as Knex);

    service.selectCategoryID = jest.fn().mockResolvedValue([{ id: 1, category: 2 } as movieID]);
    controller = new MovieDetailController(service);

    req = {
      params: {},
      query: {},
      body: {},
      session: {},
    } as express.Request;

    res = {
      status: jest.fn(() => ({
        json: () => {},
      })),
    } as any as express.Response;
  });

  it("MovieDetail -get category ID", async () => {
    await controller.getCategoryID(req, res);
    expect(res.status).toBeCalledWith(200);
  });
});
