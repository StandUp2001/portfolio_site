import { Env } from "..";
import { HEADERS } from "../utils";
import { BodyGame, BodyGameGenre, BodyGameList, BodyGamePlatform, BodyIdName } from "./database/types";
import { pathApi } from "./database/paths";
import { DB_TABLES, getKeyFromTable, hasIdName } from "./database/utils";

/**
 * Handles the routing logic for the "/nikita" path.
 * @param {string} pathname - The pathname of the request URL.
 * @param {D1Database} DB - The database instance.
 * @param {any} body - The request body.
 * @returns {Promise<Response>} - The response based on the pathname.
 */
export async function pathNikita(pathname: string, DB: D1Database, body: any): Promise<Response> {

    // If the pathname is /nikita, return "Nikita"
    const restPathname = pathname.substring(7);
    if (restPathname === "/" || restPathname === "") { return new Response("Nikita's backend app", HEADERS.TEXT); }

    // If the pathname has only ID and NAME, use the ID and NAME body to get the data
    const idNameLink = await hasIdName(restPathname, DB);
    if (idNameLink) { return await pathApi<BodyIdName>(DB, idNameLink, restPathname, body); }

    // If the pathname starts with /games, use the game body to get the data
    const gameLink = restPathname.startsWith("/games");
    if (gameLink) { return await pathApi<BodyGame>(DB, DB_TABLES.games, restPathname, body); }

    // If the pathname starts with /game-lists, use the game list body to get the data
    const gameListLink = restPathname.startsWith("/game-lists");
    if (gameListLink) { return await pathApi<BodyGameList>(DB, DB_TABLES.listGames, restPathname, body); }

    // If the pathname starts with /game-genres, use the game genre body to get the data
    const gameGenreLink = restPathname.startsWith("/game-genres");
    if (gameGenreLink) { return await pathApi<BodyGameGenre>(DB, DB_TABLES.genreGames, restPathname, body); }

    // If the pathname starts with /game-platforms, use the game platform body to get the data
    const gamePlatformLink = restPathname.startsWith("/game-platforms");
    if (gamePlatformLink) { return await pathApi<BodyGamePlatform>(DB, DB_TABLES.platformGames, restPathname, body); }

    // If the pathname is /nikita/... but not a valid path, return 404
    return new Response(`Not found: ${restPathname}`, { status: 404 });
}

