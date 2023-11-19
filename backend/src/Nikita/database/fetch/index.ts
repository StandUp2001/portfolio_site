import { ResponseJson, Statements } from "./statements";

/**
 * Represents a class for fetching data from a database.
 * @template T - The type of data being fetched.
 */
export class FetchDB<T> {

    /**
     * The statements object for executing database queries.
     */
    statements: Statements<T>;

    /**
     * Constructs a new FetchDB instance.
     * @param {D1Database} DB - The database instance.
     * @param {string} table - The name of the table.
     * @param {T} body - The data to be fetched.
     */
    constructor(DB: D1Database, table: string, body: T) {
        this.statements = new Statements<T>(DB, table, body);
    }

    /**
     * Retrieves data from the database.
     * @returns {Promise<Response>} - The response from the database.
     */
    async get(): Promise<Response> {
        return this.responseJson(await this.statements.get());
    }

    /**
     * Adds data to the database.
     * @returns {Promise<Response>} - The response from the database.
     */
    async add(): Promise<Response> {
        return this.responseJson(await this.statements.add());
    }

    /**
     * Updates data in the database.
     * @returns {Promise<Response>} - The response from the database.
     */
    async update(): Promise<Response> {
        return this.responseJson(await this.statements.update());
    }

    /**
     * Deletes data from the database.
     * @returns {Promise<Response>} - The response from the database.
     */
    async delete(): Promise<Response> {
        return this.responseJson(await this.statements.delete());
    }

    /**
     * Converts the response to JSON format.
     * @param {Response | ResponseJson<T>} res - The response from the database.
     * @returns {Promise<Response>} - The response in JSON format.
     * @private
     */
    private async responseJson(res: Response | ResponseJson<T>): Promise<Response> {
        if (res instanceof Response) { return res; }
        return Response.json(res.results);
    }
}