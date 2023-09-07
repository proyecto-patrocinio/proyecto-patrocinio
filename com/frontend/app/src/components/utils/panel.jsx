/**
 * Creates a new panel by sending a POST request to the specified URL.
 * @param {string} titlePanel - The title of the panel to be created.
 * @param {int} boardID - The ID of the board where the panel will be created.
 * @returns {Promise} A promise that resolves when the request. [Message(str), Status(bool)]
 */
async function createPanel(titlePanel, boardID) {
    const boardIntID = Number(boardID)
    console.log("ola, ",boardID)
    console.log("ola, ",boardIntID)
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
    + process.env.REACT_APP_PATH_PANELS
    console.log(titlePanel, boardID)
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            title: titlePanel,
            board: boardIntID,
            }),
        });

        let status_response = true;
        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
            status_response = false;
        }

        const data = await response.json();
        const responseDict = {
            "data": data,
            "state": status_response
        };
        return responseDict

    } catch (error) {
        console.error('Error creating panel:', error.message);
        throw error;
    }
}

export default createPanel