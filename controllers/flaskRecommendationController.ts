import { Request, Response } from "express";
import { FlaskRecommendationService } from "../services/flaskRecommendationService";
import fetch from 'node-fetch';
import { logger } from "../utils/logger";

export class FlaskRecommendationController {
    constructor(private flaskRecommendationService: FlaskRecommendationService) {
    }

    getRecommendationMovies = async (req: Request, res: Response) => {
        try {
            const fid: number = parseInt(req.params.fid, 10)

            const url = `${this.flaskRecommendationService.getFlaskURL()}${fid}`

            logger.debug(`Step F1 - The fid is: ${fid}; The Flask URL is: ${url}`)

            const r: any = await fetch(url);

            const json = await r.json();

            logger.debug(`Step F1 - The json is:${json}`);

            res.json(json);

        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: "internal server error" });
        }


    }

}