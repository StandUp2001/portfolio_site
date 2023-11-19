/**
 * Retrieves the link from the given path if it has an ID and NAME.
 * @param {string} path - The path to search for the link.
 * @param {D1Database} DB - The database instance.
 * @returns {DB_NIKITA_TABLES | null} - The link found in the path, or null if not found.
 */
export async function hasIdName(path: string, DB: D1Database): Promise<DB_NIKITA_TABLES | null> {
    for (const [key, table] of Object.entries(DB_NIKITA_TABLES)) {
        if (path.startsWith("/" + key) && isIdName(await getTablesInfo(table, DB))) { return getKeyFromTable(key); }
    }
    return null;
}

/**
 * Checks if the given columns are ID and NAME.
 * @param {Column[]} columns - The columns to check.
 * @returns {boolean} - True if the columns are ID and NAME, false otherwise.
 */
function isIdName(columns: Column[]): boolean {
    if (columns.length !== 2) { return false; }
    if (columns[0].name !== "id") { return false; }
    if (columns[1].name !== "name") { return false; }
    return true;
}

/**
 * Retrieves the corresponding DB_TABLES key from a string key.
 * @param {string} key - The string key.
 * @returns {DB_NIKITA_TABLES} - The corresponding DB_TABLES key.
 */
export function getKeyFromTable(key: string): DB_NIKITA_TABLES {
    return DB_NIKITA_TABLES[key as keyof typeof DB_NIKITA_TABLES];
}

// All the tables in the database from the Nikita app
export enum DB_NIKITA_TABLES {
    games = "NGames",
    lists = "NLists",
    users = "NUsers",
    genres = "NGenres",
    platforms = "NPlatforms",
    listGames = "NListsGames",
    genreGames = "NGenresGames",
    platformGames = "NPlatformsGames",
};

/**
 * Retrieves information about the columns of a database table.
 * @param {string} table - The name of the table.
 * @param {D1Database} DB - The database instance.
 * @returns {Promise<Column[]>} - The information about the columns.
 */
export async function getTablesInfo(table: string, DB: D1Database): Promise<Column[]> {
    const sql: string = `PRAGMA table_info(${table})`;
    const res: D1Result<Column> = await DB.prepare(sql).all();
    return res.results;
}


export type Column = {
    cid: number;
    name: string;
    type: string;
    notnull: number;
    dflt_value: null,
    pk: number;
};

/**
 * Generates and displays the routes for the database tables.
 * @param {D1Database} DB - The database instance.
 * @returns {Promise<Response>} - The response with the routes information.
 */
export async function showRoutes(DB: D1Database): Promise<Response> {
    const allRoutes: Record<string, any> = {};
    for (const [key, table] of Object.entries(DB_NIKITA_TABLES)) {
        let correctKey: string = key;
        if (key.endsWith("Games")) { correctKey = key.replace("Games", "-games"); }
        const routes: string[] = [`/${correctKey}`, `/${correctKey}/add`, `/${correctKey}/put`, `/${correctKey}/delete`];
        const body: Record<string, string> = await getBodyFromTable(table, DB);
        allRoutes[key] = { routes, body };
    }
    return Response.json(allRoutes);
}

/**
 * Retrieves the body structure from a database table.
 * @param {string} table - The name of the table.
 * @param {D1Database} DB - The database instance.
 * @returns {Promise<any>} - The body structure of the table.
 */

export async function getBodyFromTable(table: string, DB: D1Database): Promise<Record<string, string>> {
    const columns: Column[] = await getTablesInfo(table, DB);
    const body: Record<string, string> = {};
    for (const column of columns) {
        body[column.name] = column.type.toLowerCase() === "integer" ? "number" : "string";
    }
    return body;
}

