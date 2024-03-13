export interface user {
    id: number;
    username: string;
    password: string;
}

export interface FilmsCategory {
    genres: string,
    title: string
}

export interface Genres {
    id: number,
    name: string
}

export interface FilmsDesc {
    adult: boolean,
    overview: string,
    poster_path: string,
    release_date: Date,
    title: string
}

export interface RatingsList {
    userId: number,
    rating: number,
    title: string,
    vote_count: number
}

export interface CategoryWithFilms {
    user_id: number,
    film_name: string,
    category: string,
    image: string,
    release_date: Date
}
