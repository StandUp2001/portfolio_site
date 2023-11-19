import { FetchDB } from "./fetch";

/**
 * Handles the routing logic for different REST API endpoints.
 * @param {D1Database} DB - The database object.
 * @param {string} table - The name of the table.
 * @param {string} pathname - The pathname of the request URL.
 * @returns {Promise<Response>} - The response from the corresponding database operation.
 */
export async function pathApi<T>(DB: D1Database, table: string, pathname: string, body: T): Promise<Response> {
    const db = new FetchDB<T>(DB, table, body);
    const restPathname = pathname.substring(table.length + 1);
    switch (restPathname) {
        case "/":
        case "":
            return await db.get();
        case "add":
        case "/add":
        case "/add/":
            return await db.add();
        case "put":
        case "/put":
        case "/put/":
            return await db.update();
        case "delete":
        case "/delete":
        case "/delete/":
            return await db.delete();
        default:
            return new Response(`Not found: ${restPathname}`, { status: 404 });
    }
}


