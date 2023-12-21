/**
 * Makes a request to retrieve terms from an API server.
 *
 * @returns {Promise<string>} A promise that resolves with the terms if the request is successful.
 * @throws {Error} If an error occurs in the request or the response is not successful.
 */
export default async function getTerms() {
    try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                +   process.env.REACT_APP_PATH_TERMS;
    const response = await fetch(url);
    if (response.ok) {
        const board = await response.text();
        return board;
    } else {
        console.error('Failed to fetch board:', response.status);
        throw new Error('Failed to fetch board');
    }
    } catch (error) {
    console.error('Unexpected error occurred while try to get terms: ', error);
    throw error;
    }
}
