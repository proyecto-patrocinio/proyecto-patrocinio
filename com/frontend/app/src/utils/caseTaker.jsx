/***********************************************************
 * This Module contains functions for the Consultancy Page.*
 ***********************************************************/
import Cookies from "js-cookie";
import {updateCardField} from "./card";


/********************** CONSULTATIONS ************************/


/**
 * Asynchronous function to fetch a list of consultations from a REST API.
 *
 * @throws {Error} Throws an error if the API request fails.
 *
 * @returns {Promise<Object[]>} A promise that resolves to an array of consultation data objects.
 */
export const getConsultationList = async () => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                + process.env.REACT_APP_PATH_CONSULTATIONS
        const response = await fetch(url, {
                method: 'GET',
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error('Falló la obtención de las consultas. Respuesta con código:', response.status);
        }
    } catch (error) {
        console.error('Failed in fetch Consultation List.');
        console.debug(error);
        throw error;
    }
};


/**
 * Fetches Consultations that are to be assigned based on CREATED and REJECTED status.
 * @returns {Promise} A promise that resolves to the fetched data or an error.
 */
export const getConsultationsToAssign = async () => {
    return await getConsultationsByAvailability("CREATED,REJECTED");
};


/**
 * Fetches Consultations that are to be assigned based on ARCHIVED status.
 * @returns {Promise} A promise that resolves to the fetched data or an error.
 */
export const getConsultationsArchived = async () => {
    return await getConsultationsByAvailability("ARCHIVED");
};


/**
 * Fetches consultations by availability from the REST API of sponsorship.
 * @param {string} availability - The availability to be used as a filter.
 * @returns {Promise<Array>} - An array of consultations that match the availability filter.
 * @throws {Error} - Throws an error if the consultation request is not successful.
 */
export const getConsultationsByAvailability = async (availability) => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                + process.env.REACT_APP_PATH_FILTER_CONSULTATIONS_BY_AVAILABILITY
                + availability;
        const response = await fetch(url, {
                method: 'GET',
        });
        if (response.ok) {
            const data = await response.json();
            return data.map(item => ({
                ...item,
                consultation: item.id
            }));
        } else {
            throw new Error(`Falló la obtención de consultas con estado ${availability}. Respuesta con código: `, response.status);
        }
    } catch (error) {
        console.error(`Failed in fetch Consultations with status ${availability}.`);
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
        const response = await fetch(url,{
            method: 'GET',
        });
        if (response.ok) {
            const requestConsultationsList = await response.json();
            return requestConsultationsList

        } else {
            throw new Error('Falló la obtención de la consultoría. Respuesta con código: ' + response.status);
        }
    } catch (error) {
        console.error('Failed to fetch Consultancy board.');
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
        const response = await fetch(url, {
                method: 'GET',
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            throw new Error("Falló la obtención de la consulta con ID " + id +". Respuesta con código:" + response.status);
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

        const csrfToken = Cookies.get("csrftoken");
        const response = await fetch(url, {
            method: 'PATCH',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                [fieldName]: fieldValue
            }),
        })

        if (response.ok) {

            if (fieldName === 'tag') {
                // Update Card Tag if it exists. Otherwise ignore.
                updateCardField(id, 'tag', fieldValue)
            }

        } else {
            const mns = `Falló la actualización del campo '${fieldName}' de la consulta.`
            console.warn(mns);
            throw new Error(mns);
        }
    } catch (error) {
        console.error(`Error while trying to update '${fieldName}' field of Consultation: `, error.message);
        console.debug(error);
        throw error;
    }
};

/**
 * Archive a Request Consultation.
 * @param {int} requestID request consultation id.
 */
export async function archiveRequest(requestID) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
        + process.env.REACT_APP_PATH_CONSULTATIONS
        + String(requestID)
        + process.env.REACT_APP_EXTRA_PATH_ARCHIVED_REQUEST_CARDS;

        const csrfToken = Cookies.get("csrftoken");
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        });

        if (!response.ok) {
            console.error('Could not be archived for request Consultation', requestID ,'. Status code:', response.status);
            throw new Error('No se pudo archivar la solicitud de consulta.');
        };

        console.info("Successful achive Request for Consultation ID:", requestID)
    } catch (error) {
        console.error('Error in archive request consultation.');
        console.debug(error)
        throw error;
    };
};

/**
 * Delete a Consultation.
 * @param {int} consultationID - consultation id.
 * @returns {Promise<boolean>} True if successfully deleted the Consultation. Otherwise false.
 */
export async function deleteConsultation(consultationID) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
        + process.env.REACT_APP_PATH_CONSULTATIONS
        + String(consultationID)
        + "/"

        const csrfToken = Cookies.get("csrftoken");
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        })

        if (!response.ok) {
            const mns = `No se pudo eliminar la consulta con ID ${consultationID}.`
            console.error(mns ,' Status code:', response.status);
            throw new Error(mns);
            }

        console.info("Successful delete Consultation ID:", consultationID)
        return true;
    } catch (error) {
        console.error('Error in delete consultation.');
        console.debug(error)
        throw error;
    }
}


/**
 * Updates a consultation on the server using a PUT request.
 *
 * @param {Object} data - The data of the consultation to be updated.
 * @throws {Error} If the update request fails or if an unexpected error occurs.
 */
export const updateConsultation = async (data) => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                    + process.env.REACT_APP_PATH_CONSULTATIONS
                    + String(data.id)
                    + "/";

        const newData = {
            "tag": data.tag,
            "availability_state": data.availability_state,
            "progress_state": data.progress_state,
            "opponent": data.opponent,
            "description": data.description,
        }

        const csrfToken = Cookies.get("csrftoken");
        const response = await fetch(url, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(newData),
        })
        if (response.ok) {
            // Update Card Tag if it exists. Otherwise ignore.
            updateCardField(data.id, 'tag', data.tag)
            const consultation = await response.json();
            return consultation;
        } else {
            const mns = `No se pudo actualizar la consulta con ID '${data.id}'.`
            console.warn(mns, "Status: " + response.status);
            throw new Error(mns);
        }
    } catch (error) {
        console.error(`Unexpected error while trying to update Consultation with ID '${data.id}': `, error.message);
        console.debug(error);
        throw error;
    }
};


/**
 * Creates a new consultation on the server using a POST request.
 *
 * @param {Object} data - Dict with the data of the consultation to be created.
 * @returns {Promise<object>} A promise that resolves to the created consultation.
 * @throws {Error} If the create request fails or if an unexpected error occurs.
 */
export const createConsultationByDict = async (data) => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                    + process.env.REACT_APP_PATH_CONSULTATIONS;
        const newData = {
            "tag": data.tag,
            "opponent": data.opponent,
            "description": data.description,
            "client": data.client
        }

        const csrfToken = Cookies.get("csrftoken");
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(newData),
        })

        const responseJson = await response.json();
        if (response.ok) {
            const consultation = responseJson;
            return consultation;
        } else {
            if (responseJson.client != null || responseJson.client !== undefined) {
                responseJson.client = "[Por favor, ingresar un DNI o pasaporte de cliente existente válido.]"
            };
            const mns = (JSON.stringify(responseJson)).replace(/["{}]/g, '');
            console.warn(mns, "Status: " + response.status);
            throw new Error(mns);
        }
    } catch (error) {
        console.error('Unexpected error while trying to create Consultation: ', error.message);
        console.debug(error);
        throw error;
    }
};

/**
 * Fetches logs for a specific board that started N days ago.
 *
 * @param {number} days - The number of days for which logs are requested.
 * @param {string} boardID - The ID of the board for which logs are requested.
 * @returns {Promise<Array>} - A promise that resolves to an array of logs.
 * @throws {Error} - If the fetch operation fails.
 */
export async function getBoardLogs(days, boardID){
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                    + process.env.REACT_APP_PATH_BOARD
                    + boardID
                    + process.env.REACT_APP_EXTRA_PATH_BOARD_LOGS
                    + days;
        const response = await fetch(url,{
            method: 'GET',
        });
        if (response.ok) {
            const logs = await response.json();
            return logs

        } else {
            throw new Error(`Falló la obtención de los logs del tablero ${boardID}. Código de respuesta: ${response.status}`);
        }
    } catch (error) {
        console.error(`Unexpected error while trying to fetch logs of Board ${boardID}.`);
        console.debug(error);
        throw error;
    }
};

/********************** CONSULTATION REQUEST *************************/

/**
 * Delete pending Request by Consultation.
 * @param {int} consultID consultation id to remove pending request.
 */
export async function deleteRequest(consultID) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
        + process.env.REACT_APP_PATH_CONSULTATIONS
        + String(consultID)
        + process.env.REACT_APP_EXTRA_PATH_CLEAR_REQUEST;

        const csrfToken = Cookies.get("csrftoken");
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        });

        if (!response.ok) {
            console.error('Failed to clear request for Consultation ', consultID ,'. Status code:', response.status);
            throw new Error('No se pudo eliminar la solicitud de consulta.');
        };

        console.info("Successful delete Request for Consultation ID:", consultID)
    } catch (error) {
        console.error('Error in delete request consultation.');
        console.debug(error)
        throw error;
    };
};


/**
 * Create a request consultation for to send a consultation to a specified board.
 * @param {int} consultationID consultation id to create Request.
 * @param {int} destinationBoardID destination board id to send Consultation Request.
 */
export async function createRequest(consultationID, destinationBoardID) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
        + process.env.REACT_APP_PATH_REQUEST_CARDS

        const csrfToken = Cookies.get("csrftoken");
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({
                "consultation": consultationID,
                "destiny_board": destinationBoardID,
                "state": "PENDING",
                "resolution_timestamp": null
            }),
        })

        if(!response.ok) {
            console.error('Failed to POST request Consultation:', response.status);
            throw new Error('Falló la creación de la Solicitud de Consulta');
        }
        console.info("Successfull Create Reques for Consultatio ID:", consultationID)
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
        + process.env.REACT_APP_PATH_CONSULTATIONS;
        const newConsult = {
            "description": description,
            "opponent": opponent,
            "tag": tag,
            "client": clientID
        };

        const csrfToken = Cookies.get("csrftoken");
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
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
    };
};
