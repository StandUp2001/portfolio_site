import { getIndex } from "./html/home";

export const HEADERS = {
    // HEADERS for the response
    JSON: header("application/json"),
    HTML: header("text/html"),
    TEXT: header("text/plain"),
};

/**
 * Returns the headers object with the specified content type and charset.
 * @param {string} type - The content type.
 * @returns {Object} - The headers object.
 */
function header(type: string): Object {
    return { headers: { "content-type": type + ";charset=UTF-8" } };
}

/**
 * Converts an HTML file to plain text.
 * @param {string} file - The name of the HTML file.
 * @returns {string} - The plain text content of the HTML file.
 */
export function htmlToText(file: string): string {
    // TODO
    const filePath = `./src/html/${file}`;
    console.log(filePath);
    // read in the file
    // const text = fs.readTextFileSync(filePath);
    return getIndex();
}

/**
 * Retrieves the body of a request.
 * @param {Request} req - The request object.
 * @returns {Promise<any>} - The body of the request.
 */
export function getBody(req: Request): Promise<any> {
    if (req.body) { return req.json(); }
    return Promise.resolve(null);
}

