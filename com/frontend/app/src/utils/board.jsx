/**************************************************************************
* This module houses essential functions for interacting with board data. *
***************************************************************************/
import Cookies from "js-cookie";


/**
 * Fetches data for a specific board from the API.
 *
 * @param {number} boardID - The ID of the board to retrieve data for.
 * @returns {Promise<Object>} A Promise that resolves with the board data if the request is successful.
 * @throws {Error} Throws an error if the request to the API fails.
 */
async function getDataBoard(boardID) {
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_BOARD
      + boardID;
      const token = window.localStorage.getItem('loggedCaseManagerUser');
      const response = await fetch(url,
        {
          method: 'GET',
          headers: {'Authorization': `Token ${token}`}
        }
      );
    if (response.ok) {
      const board = await response.json();
      return board;
    } else {
      console.error('Failed to fetch board:', response.status);
      throw new Error('Failed to fetch board');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
export default getDataBoard;


/**
 * Fetch Boards by User.
 *
 * This function fetches a list of boards associated with a user by their ID.
 *
 * @param {number} idUser - The ID of the user.
 * @returns {Promise<Array>} A promise that resolves to an array of board data.
 */
export const fetchBoardsByUser = async (idUser) => {
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_USERBOARD_BY_USER
      + idUser;
    const token = window.localStorage.getItem('loggedCaseManagerUser');
    const response = await fetch(url,
      {
        method: 'GET',
        headers: {'Authorization': `Token ${token}`}
      }
    );
    if (response.ok) {
      const data = await response.json();
      const boardPromises = data.map((item) => getDataBoard(item.board));
      const boardList = await Promise.all(boardPromises);
      return boardList;
    } else {
      console.error('Failed to fetch board-user:', response.status);
      return [];
    }
  } catch (error) {
    console.error('Unexpected error when try to fetch board by userID ', idUser);
    console.debug('Error Detail: ', error);
    return [];
  }
};


/**
 * Accepts a consultation request by sending a POST request to the API.
 *
 * @param {number} requestConsultationID - The ID of the consultation request to accept.
 * @param {number} panelID - The ID of the panel where the consultation request will be accepted.
 * @return {boolean} True if the request was accepted, false otherwise.
 */
export const acceptRequestConsult = async(requestConsultationID, panelID) => {
  try{
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
    + process.env.REACT_APP_PATH_REQUEST_CARDS
    + String(requestConsultationID)
    + process.env.REACT_APP_EXTRA_PATH_ACCEPT_REQUEST_CARDS;

    const csrfToken = Cookies.get("csrftoken");
    const token = window.localStorage.getItem('loggedCaseManagerUser');
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({
        "destiny_panel": panelID
      })
    });

    if (response.ok) {
      const successMessage = `Request Consultation ${requestConsultationID} accepted successfully`;
      console.info(successMessage);
      return true;
    } else {
      console.error("Failed to accept the consultation request: ", response.status);
      return false;
    }
  } catch (error) {
    console.error('Unexpected error when try to accept the consultation request:', error);
    return false;
  }
}


/**
 * Rejects a consultation request by sending a POST request to the API.
 *
 * @param {number} id - The ID of the request Consultation to reject.
 * @return {boolean} True if the request was rejected, false otherwise.
 */
export const rejectRequestConsult = async(id) => {
  try{
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
    + process.env.REACT_APP_PATH_REQUEST_CARDS
    + String(id)
    + process.env.REACT_APP_EXTRA_PATH_REJECTED_REQUEST_CARDS;

    const csrfToken = Cookies.get("csrftoken");
    const token = window.localStorage.getItem('loggedCaseManagerUser');
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Token ${token}`
      },
    });

    if (response.ok) {
      const successMessage = `Request Consultation ${id} rejected successfully`;
      console.info(successMessage);
      return true;
    } else {
      console.error("Failed to reject the consultation request: ", response.status);
      return false;
    };

  } catch (error) {
    console.error('Unexpected error when try to reject  the consultation request:', error);
    return false;
  };
};


/**
 * Fetches the list of boards.
 * @returns {Promise} A promise that resolves to the fetched board list or an error.
 * @throws {Error} Throws an error if the request to the API fails.
 */
export const getListBoard = async () => {
  try {
      const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                  + process.env.REACT_APP_PATH_BOARD;

      const token = window.localStorage.getItem('loggedCaseManagerUser');
      const response = await fetch(url, {
          method: 'GET',
          headers: {'Authorization': `Token ${token}`}
        }
        );
      if (response.ok) {
          const boardList = await response.json();
          return boardList;
      } else {
          throw new Error('Failed to fetch board. Status Code: ' , response.status);
      };

  } catch (error) {
      console.error('Failed to fetch board.');
      console.debug(error);
      throw error;
  };
};


/**
 * Updates the title of a Board by sending a PATCH request to the API.
 *
 * @param {number} id - The ID of the Board to update.
 * @param {string} newTitle - The new title to set for the Board.
 * @returns {Promise<string|null>} - A promise that resolves to the updated title if successful, or null if there was an error.
 */
export const updateBoardTitle = async (id, newTitle) => {
  try {
      const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                  + process.env.REACT_APP_PATH_BOARD
                  + String(id)
                  + "/";

      const csrfToken = Cookies.get("csrftoken");
      const token = window.localStorage.getItem('loggedCaseManagerUser');
      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          "title": newTitle
        }),
      });

      if (response.ok) {
          const requestPanel = await response.json();

          return requestPanel['title'];

      } else {
          console.warn(`Failed to update the Title field of Board.`);
          return null;
      };

  } catch (error) {
      console.error(`Error while making the PATCH request for the Title field of Board:`, error.message);
      console.debug(error);
      throw error;
  };
};
