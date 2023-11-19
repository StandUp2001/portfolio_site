export type BodyGame = {
    id?: number;
    name: string;
    slug: string;
    released: string;
    image_id: string | null;
};

export type BodyIdName = { id: number; name: string; };

export type BodyGameList = {
    id?: number;
    game_id: number;
    list_id: number;
    user_id: number;
};

export type BodyGameGenre = {
    id?: number;
    game_id: number;
    genre_id: number;
};

export type BodyGamePlatform = {
    id?: number;
    game_id: number;
    platform_id: number;
};

