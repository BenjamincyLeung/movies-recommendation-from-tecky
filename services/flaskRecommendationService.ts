export class FlaskRecommendationService {
    constructor (private url:string) {
    }

    getFlaskURL():string {
        return this.url + "recommendation/";
    }
}