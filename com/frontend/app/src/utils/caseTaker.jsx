/***********************************************************
 * This Module contains functions for the Consultancy Page.*
 ***********************************************************/

import {updateCardField} from "./card";

/********************** CONSULTATIONS ************************/
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
 * Fetches Consultancy data, this contains information about the all boards with your consultations.
 * @returns {Promise} A promise that resolves to the fetched request card list or an error.
 */
export const getConsultancyBoard = async () => {
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
};


/**
 * Fetch Consultation.
 * @returns {Promise} A promise that resolves to the fetched consultation or an error.
 */
export const getConsultation = async (id) => {
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
 * Makes a PATCH request to update a specific field of a consultation.
 * @param {string} id - The ID of the consultation to be updated.
 * @param {string} fieldName - The name of the field to be updated.
 * @param {any} fieldValue - The new value to be assigned to the field.
 * @returns {Promise} - A promise that resolves with the new value in the field. On rejects returns null.
 * @throws {Error} - If the PATCH request is not successful.
 */
export const updateConsultationField = async (id, fieldName, fieldValue) => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                    + process.env.REACT_APP_PATH_CONSULTATIONS
                    + String(id)
                    + "/";

        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                [fieldName]: fieldValue
            }),
            })

        if (response.ok) {
            const requestConsultation = await response.json();

            if (fieldName === 'tag') {
                // Update Card Tag if it exists. Otherwise ignore.
                updateCardField(id, 'tag', fieldValue)
            }
            return requestConsultation[fieldName];

        } else {
            console.warn(`Failed to update the '${fieldName}' field of Consultation.`);
            return null;
        }
    } catch (error) {
        console.error(`Error while making the PATCH request for the '${fieldName}' field of Consultation:`, error.message);
        console.debug(error);
        throw error;
    }
};


/********************** CONSULTATION REQUEST *************************/

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


/**
 * Create new consultation.
 * @param {string} description - The description of the consultation.
 * @param {string} opponent - The name of the opponent in the consultation.
 * @param {string} tag - The tag associated with the consultation.
 * @param {number} clientID - The ID of the client associated with the consultation.
 * @returns {Promise<{success: boolean, content?: any}>} An object containing the success status,
 * an optional message, and the response data.
 */
export async function createConsultation(description, opponent, tag, clientID) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
        + process.env.REACT_APP_PATH_CONSULTATIONS
        const newConsult = {
            "description": description,
            "opponent": opponent,
            "tag": tag,
            "client": clientID
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newConsult),
        })

        const responseData = await response.json();
        if(!response.ok) {
            console.error('Failed to POST Consultation:', response.status);
            return { success: false, content: responseData};
        }
        console.info("Successfull Create Consultation with ID: ", responseData.id);
        return { success: true, content: responseData };

    } catch (error) {
        console.error('Unexpected error in create consultation.');
        console.debug(error)
        return { success: false, content: {'all': 'Unexpected error occurred.'} };
    }
}
