/***********************************************************
 * This Module contains functions for the Consultancy Page.*
 ***********************************************************/

/**
 * Fetches Consultations that are to be assigned based on CREATED status.
 * @returns {Promise} A promise that resolves to the fetched data or an error.
 */
export const getConsultationsToAssign = async () => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                + process.env.REACT_APP_PATH_FILTER_CONSULTATIONS_WITH_STATUS
                + "CREATED";
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.map(item => ({
                ...item,
                consultation: item.id
            }));
        } else {
            throw new Error('Failed in fetch Consultations with status CREATED. Status Code:', response.status);
        }
    } catch (error) {
        console.error('Failed in fetch Consultations with status CREATED.');
        console.debug(error);
        throw error;
    }
};


/**
 * Fetches the list of boards.
 * @returns {Promise} A promise that resolves to the fetched board list or an error.
 */
export const getListBoard = async () => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                    + process.env.REACT_APP_PATH_BOARD;
        const response = await fetch(url);
        if (response.ok) {
            const boardList = await response.json();
            return boardList;
        } else {
            throw new Error('Failed to fetch board. Status Code: ' , response.status);
        }
    } catch (error) {
        console.error('Failed to fetch board.');
        console.debug(error);
        throw error;
    }
}


/**
 * Fetches the list of boards with your request consultations.
 * @returns {Promise} A promise that resolves to the fetched request card list or an error.
 */
export const getAllBoardWithRequests = async () => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                    + process.env.REACT_APP_PATH_REQUEST_CONSULTANCY_BOARD;
        const response = await fetch(url);
        if (response.ok) {
            const requestConsultationsList = await response.json();
            return requestConsultationsList

        } else {
            throw new Error('Failed to fetch Request Card. Status code: ' + response.status);
        }
    } catch (error) {
        console.error('Failed to fetch Request Card.');
        console.debug(error);
        throw error;
    }
}


/**
 * Fetch Consultation.
 * @returns {Promise} A promise that resolves to the fetched consultation or an error.
 */
const getConsultation = async (id) => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                + process.env.REACT_APP_PATH_CONSULTATIONS
                + String(id)
                + "/";
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error("Failed in fetch Consultation with ID " + id +". Status Code:" + response.status);
        }
    } catch (error) {
        console.error("Failed in fetch Consultation with ID " + id);
        console.debug(error);
        throw error;
    }
};


/**
 * Delete a Request Consultation.
 * @param {int} requestID request consultation id.
 */
export async function deleteRequest(requestID) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
        + process.env.REACT_APP_PATH_REQUEST_CARDS
        + String(requestID)
        + "/"

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            console.error('Failed to DELETE request Consultation', requestID ,'. Status code:', response.status);
            throw new Error('Failed to DELETE request consultation.');
            }

        console.log("Successful delete Request for Consultation ID:", requestID)
    } catch (error) {
        console.error('Error in delete request consultation.');
        console.debug(error)
        throw error;
    }
}


/**
 * Create a request consultation for to send a consultation to a specified board.
 * @param {int} consultationID consultation id to create Request.
 * @param {int} destinationBoardID destination board id to send Consultation Request.
 */
export async function createRequest(consultationID, destinationBoardID) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
        + process.env.REACT_APP_PATH_REQUEST_CARDS

        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "consultation": consultationID,
            "destiny_board": destinationBoardID
        }),
        })

        if(!response.ok) {
            console.error('Failed to POST request Consultation:', response.status);
            throw new Error('Failed to POST request consultation.');
        }
        console.log("Successfull Create Reques for Consultatio ID:", consultationID)
    } catch (error) {
        console.error('Error in create request consultation.');
        console.debug(error)
        throw error;
    }
}
