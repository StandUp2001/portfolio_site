import { HEADERS } from "../utils";
import { BodyGame, BodyGameGenre, BodyGameList, BodyGamePlatform, BodyIdName } from "./database/types";
import { pathApi } from "./database/paths";
import { DB_NIKITA_TABLES, hasIdName, showRoutes } from "./database/utils";

/**
 * Handles the routing logic for the "/nikita" path.
 * @param {string} pathname - The pathname of the request URL.
 * @param {D1Database} DB - The database instance.
 * @param {any} body - The request body.
 * @returns {Promise<Response>} - The response based on the pathname.
 */
export async function pathNikita(pathname: string, DB: D1Database, body: any): Promise<Response> {
    // If the pathname is /nikita, return Message
    const restPathname = pathname.substring(7);
    const message = `Nikita's backend app look at /routes for all routes and body structure`;
    if (restPathname === "/" || restPathname === "") { return new Response(message, HEADERS.TEXT); }

    // If the pathname is /nikita/routes, return the routes
    if (restPathname === "/routes") { return await showRoutes(DB); }

    // If the pathname has only ID and NAME, use the ID and NAME body to get the data
    const idNameLink = await hasIdName(restPathname, DB);
    if (idNameLink) { return await pathApi<BodyIdName>(DB, idNameLink, restPathname, body); }

    // If the pathname starts with /games, use the game body to get the data
    const gameLink = restPathname.startsWith("/games");
    if (gameLink) { return await pathApi<BodyGame>(DB, DB_NIKITA_TABLES.games, restPathname, body); }

    // If the pathname starts with /list-games, use the game list body to get the data
    const gameListLink = restPathname.startsWith("/list-games");
    if (gameListLink) { return await pathApi<BodyGameList>(DB, DB_NIKITA_TABLES.listGames, restPathname, body); }

    // If the pathname starts with /genre-games, use the game genre body to get the data
    const gameGenreLink = restPathname.startsWith("/genre-games");
    if (gameGenreLink) { return await pathApi<BodyGameGenre>(DB, DB_NIKITA_TABLES.genreGames, restPathname, body); }

    // If the pathname starts with /platform-games, use the game platform body to get the data
    const gamePlatformLink = restPathname.startsWith("/platform-games");
    if (gamePlatformLink) { return await pathApi<BodyGamePlatform>(DB, DB_NIKITA_TABLES.platformGames, restPathname, body); }

    // If the pathname is /nikita/... but not a valid path, return 404
    return new Response(`Not found: ${restPathname}`, { status: 404 });
}

