/**
 * Creates a new panel by sending a POST request to the specified URL.
 * @param {string} titlePanel - The title of the panel to be created.
 * @param {int} boardID - The ID of the board where the panel will be created.
 * @returns {Promise} A promise that resolves when the request. [Message(str), Status(bool)]
 */
async function createPanel(titlePanel, boardID) {
    const boardIntID = Number(boardID);
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
    + process.env.REACT_APP_PATH_PANELS;
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
            console.error(`Failed to POST Panel: ${response.statusText}`);
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


/**
 * Updates the title of a panel by sending a PATCH request to the API.
 *
 * @param {number} id - The ID of the panel to update.
 * @param {string} newTitle - The new title to set for the panel.
 * @returns {Promise<string|null>} - A promise that resolves to the updated title if successful, or null if there was an error.
 */
export const updatPanelTitle = async (id, newTitle) => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                    + process.env.REACT_APP_PATH_PANELS
                    + String(id)
                    + "/";

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "title": newTitle
            }),
            })

        if (response.ok) {
            const requestPanel = await response.json();

            return requestPanel['title'];

        } else {
            console.warn(`Failed to update the Title field of Panel.`);
            return null;
        }
    } catch (error) {
        console.error(`Error while making the PATCH request for the Title field of Panel:`, error.message);
        console.debug(error);
        throw error;
    }
};


/**
 * Delete a panel from the REST API.
 *
 * @param {number} id - The ID of the panel to delete.
 * @returns {Promise<boolean>} - A promise that resolves to true if the panel is deleted successfully, or false otherwise.
 * @throws {Error} - Throws an error if there's an issue with the deletion process.
 */
export const deletePanel = async(id) => {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
    + process.env.REACT_APP_PATH_PANELS
    + String(id)
    + "/";

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
            'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Failed to DELETE Panel: ${response.statusText}`);
            return false;
        }

        console.info("Panel deleted successfully..")
        return true

    } catch (error) {
        console.error('Error deleting panel:', error.message);
        throw error;
    }
};