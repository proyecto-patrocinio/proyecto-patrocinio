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
                + process.env.REACT_APP_FILTER_CONSULTATIONS_WITH_STATUS
                + "CREATED";
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data.map(item => ({
                ...item,
                consultation: item.id
            }));
        } else {
            throw new ('Failed in fetch Consultations with status CREATED. Status Code:', response.status);
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
            const board_list = await response.json();
            return board_list;
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
 * Fetches the list of request consultations.
 * @returns {Promise} A promise that resolves to the fetched request card list or an error.
 */
export const getRequestConsultations = async () => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                    + process.env.REACT_APP_PATH_REQUEST_CARDS;
        const response = await fetch(url);
        if (response.ok) {
            const request_consultations_list = await response.json();
            return request_consultations_list.map(item => ({
                ...item,
                tag: getConsultation(item.consultation).tag,
                id: item.consultation
            }));
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
 * Fetch Conultation.
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
            throw new ("Failed in fetch Consultation with ID " + id +". Status Code:" + response.status);
        }
    } catch (error) {
        console.error("Failed in fetch Consultation with ID " + id);
        console.debug(error);
        throw error;
    }
};


/**
 * Delete a Request Consultation.
 * @param {int} request consultation id 
 */
export async function deleteRequest(request_id) {
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_REQUEST_CARDS
      + String(request_id)
      + "/"

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
          console.error('Failed to DELETE request Consultation', request_id ,'. Status code:', response.status);
          throw new Error('Failed to DELETE request consultation.');
        }

      console.log("Successful delete Reques for Consultatio ID:", request_id)
  } catch (error) {
    console.error('Error in delete request consultation.');
    console.debug(error)
    throw error;
  }
}


/**
 * Create a request consultation for to send a consultation to a specified board.
 * @param {int} consultation id.
 * @param {int} destination board id.
 */
export async function createRequest(consultation_id, destination_board_id) {
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_REQUEST_CARDS

    const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "consultation": consultation_id,
        "destiny_board": destination_board_id
      }),
    })

    if( !response.ok) {
          console.error('Failed to POST request Consultation:', response.status);
          throw new Error('Failed to POST request consultation.');
    }
    console.log("Successful Create Reques for Consultatio ID:", consultation_id)
  } catch (error) {
    console.error('Error in create request consultation.');
    console.debug(error)
    throw error;
  }
}
