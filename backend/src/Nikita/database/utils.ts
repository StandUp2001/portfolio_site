/**
 * Retrieves the link from the given path if it has an ID and NAME.
 * @param {string} path - The path to search for the link.
 * @param {D1Database} DB - The database instance.
 * @returns {DB_TABLES | null} - The link found in the path, or null if not found.
 */
export async function hasIdName(path: string, DB: D1Database): Promise<DB_TABLES | null> {
    for (const [key, table] of Object.entries(DB_TABLES)) {
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
 * @returns {DB_TABLES} - The corresponding DB_TABLES key.
 */
export function getKeyFromTable(key: string): DB_TABLES {
    return DB_TABLES[key as keyof typeof DB_TABLES];
}

// All the tables in the database
export enum DB_TABLES {
    games = "NGames",
    lists = "NLists",
    users = "NUsers",
    genres = "NGenres",
    platforms = "NPlatforms",
    listGames = "NListsGames",
    genreGames = "NGenresGames",
    platformGames = "NPlatformsGames",
};


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