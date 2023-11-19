import { Column, getTablesInfo } from "../utils";



export type ResponseJson<T> = {
    success: boolean;
    meta: Meta;
    results: T[];
};

type Meta = {
    served_by: string,
    duration: number,
    changes: number,
    last_row_id: number,
    changed_db: boolean;
    size_after: number,
};
/**
 * Represents a class for executing statements on a database table.
 * @template T - The type of data being manipulated.
 */
export class Statements<T> {

    /**
     * The name of the table.
     */
    table: string;

    /**
     * The database instance.
     */
    DB: D1Database;

    /**
     * The template object representing the structure of the table.
     */
    template: T;

    /**
     * The data to be manipulated.
     */
    body: T;

    /**
     * Constructs a new Statements instance.
     * @param {D1Database} DB - The database instance.
     * @param {string} table - The name of the table.
     * @param {T} body - The data to be manipulated.
     */
    constructor(DB: D1Database, table: string, body: T) {
        this.table = table;
        this.DB = DB;
        this.template = {} as T;
        this.body = body;
    }

    /**
     * Retrieves data from the database table.
     * @returns {Promise<ResponseJson<T> | Response>} - The response from the database.
     */
    async get(): Promise<ResponseJson<T> | Response> {
        await this.checkTemplate();
        const statement = `SELECT * FROM ${this.table}`;
        if (!this.body || this.isEmpty()) { return await this.DB.prepare(statement).all() as ResponseJson<T>; }
        if (!this.onlyOneProvided()) { return this.error("Only one parameter allowed"); }
        const allProps = (this.body as any);
        const [key, value] = Object.entries(allProps)[0];
        const res: ResponseJson<T> = await this.DB.prepare(`${statement} WHERE ${key} = ?`).bind(value).all() as ResponseJson<T>;
        const result: T[] = res.results;
        if (!result.length) { return this.error(`No item found with '${key} = ${value}'`); }
        return Response.json(result.length === 1 ? result[0] : result);
    }

    /**
     * Adds data to the database table.
     * @returns {Promise<ResponseJson<T> | Response>} - The response from the database.
     */
    async add(): Promise<ResponseJson<T> | Response> {
        await this.checkTemplate();
        const id = this.getBodyId(true);
        if (typeof id === "string") { return this.error(id); }
        const missingKey = this.isFullBodyProvided();
        if (missingKey) { return this.error(`Missing ${missingKey.toString()}`); }
        const keys = this.getAllPropsKey();
        const values = this.getOnlyPropsValue();
        if (values.length !== keys.length) { return this.error("Could not add item, wrong number of values provided"); }
        const sqlKeys = keys.join(", ");
        const sqlValues = values.map(value => typeof value === "string" ? `"${value}"` : value).join(", ");
        const response = await this.prepare(`INSERT OR IGNORE INTO ${this.table}(${sqlKeys}) VALUES(${sqlValues})`);
        if (response instanceof Response) { return response; }
        if (!response.meta.changes && !response.meta.last_row_id) { return this.error("Could not add item, possible it is something to do with one of the props already exist that can't have a duple"); }
        this.body = { id: response.meta.last_row_id } as any;
        return await this.get();
    }

    /**
     * Updates data in the database table.
     * @returns {Promise<ResponseJson<T> | Response>} - The response from the database.
     */
    async update(): Promise<ResponseJson<T> | Response> {
        await this.checkTemplate();
        const id = this.getBodyId();
        if (typeof id === "string") { return this.error(id); }
        const keys = this.getAllPropsKey();
        if (!keys.length) { return this.error("No body provided"); }
        const values = this.getOnlyPropsValue();
        const res = await this.prepare(`UPDATE ${this.table} SET ${this.getSqlSetString(keys, values)} WHERE id = ?`, [id]);
        if (res instanceof Response) { return res; }
        this.body = { id } as any;
        return await this.get();
    }

    /**
     * Deletes data from the database table.
     * @returns {Promise<ResponseJson<T> | Response>} - The response from the database.
     */
    async delete(): Promise<ResponseJson<T> | Response> {
        await this.checkTemplate();
        const id = this.getBodyId();
        if (typeof id === "string") { return this.error(id); }
        if (!this.onlyOneProvided()) { return this.error("Only one parameter (id) allowed"); }
        this.body = { id } as any;
        const select = await this.get();
        if (select instanceof Response) { return select; }
        return this.prepare(`DELETE FROM ${this.table} WHERE id = ? `, [id]);
    }

    /**
     * Retrieves the keys of all properties in the body object.
     * @param {boolean} skipId - Whether to skip the "id" property, defaults to true.
     * @returns {string[]} - The property keys.
     * @private
     */
    private getAllPropsKey(skipId: boolean = true): string[] {
        return Object.keys(this.body as any).filter(key => !(skipId && key === "id"));
    }

    /**
     * Retrieves the ID from the body object.
     * @returns {number} - The ID.
     * @private
     */
    private getId(): number {
        return (this.body as any).id;
    }

    /**
     * Retrieves the values of all properties in the body object.
     * @param {boolean} skipId - Whether to skip the "id" property, defaults to true.
     * @returns {any[]} - The property values.
     * @private
     */
    private getOnlyPropsValue(skipId: boolean = true): any[] {
        return Object.values(this.body as any).filter((_, index) => !(skipId && Object.keys(this.body as any)[index] === "id"));
    }

    private async checkTemplate(): Promise<void> {
        if (!this.template || !Object.keys(this.template).length) { this.template = await this.createTemplate(); }
    }

    /**
     * Checks if only one property is provided in the body object.
     * @returns {boolean} - Whether only one property is provided.
     * @private
     */
    private onlyOneProvided(): boolean {
        const keys = Object.keys(this.body as any) as (keyof T)[];
        const indexes = keys.filter(key => this.body[key] !== undefined);
        return indexes.length === 1;
    }

    /**
     * Checks if the body object is empty.
     * @returns {boolean} - Whether the body object is empty.
     * @private
     */
    private isEmpty(): boolean {
        const keys = Object.keys(this.body as any) as (keyof T)[];
        for (const key of keys) {
            if (this.body[key] !== undefined) { return false; }
        }
        return true;
    }

    /**
     * Checks if all properties in the template object are provided in the body object.
     * @param {boolean} skipId - Whether to skip the "id" property, defaults to true.
     * @returns {undefined | keyof T} - The missing property key, if any.
     * @private
     */
    private isFullBodyProvided(skipId: boolean = true): undefined | keyof T {
        return Object.keys(this.template as any).find(key => skipId && key === "id" ? false : (this.body as any)[key] === undefined) as keyof T | undefined;
    }

    /**
     * Creates a Response object with an error message.
     * @param {string} message - The error message.
     * @returns {Response} - The Response object.
     * @private
     */
    private error(message: string): Response {
        return Response.json({ error: message }, { status: 400 });
    }

    /**
     * Prepares and executes a database statement.
     * @param {string} statement - The SQL statement.
     * @param {any} bindObject - The values to bind to the statement.
     * @returns {Promise<ResponseJson<T>>} - The response from the database.
     * @private
     */
    private async prepare(statement: string, bindObject: any = null): Promise<ResponseJson<T> | Response> {
        try {
            if (!bindObject) { return await this.DB.prepare(statement).run() as ResponseJson<T>; }
            return await this.DB.prepare(statement).bind(bindObject.join(", ")).run() as ResponseJson<T>;
        }
        catch (error: any) {
            return this.error(error.message);
        }
    }

    /**
     * Creates a template object representing the structure of the table.
     * @returns {Promise<T>} - The template object.
     * @private
     */
    private async createTemplate(): Promise<T> {
        const columns: Column[] = await getTablesInfo(this.table, this.DB);
        const obj: any = {};
        for (const column of columns) {
            obj[column.name] = null;
            if (column.pk) { obj[column.name] = 0; }
            if (column.notnull) {
                if (column.type === "INTEGER") { obj[column.name] = 0; }
                if (column.type === "TEXT") { obj[column.name] = ""; }
                if (column.type === "BOOLEAN") { obj[column.name] = false; }
            }
        }
        return obj as T;
    }

    /**
     * Generates a string representing the SET clause in an SQL UPDATE statement.
     * @param {string[]} keys - The property keys.
     * @param {any[]} values - The property values.
     * @returns {string} - The SET clause string.
     * @private
     */
    private getSqlSetString(keys: string[], values: any[]): string {
        return keys.map((key, i) => {
            return `${key} = ${typeof this.template[key as keyof T] === "string" ? `"${(values as any)[i]}"` : (values as any)[i]}`;
        }).join(", ");
    }

    /**
     * Retrieves the ID from the body object.
     * @param {boolean} add - Whether the operation is an "add" operation.
     * @returns {number | string} - The ID or an error message.
     * @private
     */
    private getBodyId(add: Boolean = false): number | string {
        if (!this.body) { return "No body provided"; }
        const id = this.getId();
        if (add && id) { return "Id provided for adding, use put instead"; }
        if (!add && !id) { return "No id provided"; }
        return id;
    }

};