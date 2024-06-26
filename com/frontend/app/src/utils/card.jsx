/**************************************************************************************************************
* This module provides functions for interacting with the backend API to perform operations related to cards. *
***************************************************************************************************************/
import Cookies from "js-cookie";


/**
 * Move a card to a different panel by sending a PATCH request to the backend API.
 *
 * @param {number} cardID - The ID of the card to be moved.
 * @param {number} destinyPanelID - The ID of the destination panel where the card should be moved.
 * @returns {Promise<boolean>} - A Promise that resolves to `true` if the card was successfully moved, and `false` if there was an error.
 */
async function moveCard(cardID, destinyPanelID) {
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_CARDS
      + String(cardID)
      + "/";

      const csrfToken = Cookies.get("csrftoken");
      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify({"panel": destinyPanelID,}),
      });

      if(response.ok){
        return true;
      } else {
        console.error('Failed to PATCH card, with ID', cardID, '. Status: ', response.status);
        return false;
      }

  } catch (error) {
    console.error('Error in moveCard: ', error);
    return false;
  }
};

export default moveCard;


/**
 * Fetches data for a specific CARD from the API.
 *
 * @param {number} cardID - The ID of the Card to retrieve data for.
 * @returns {Promise<Object>} A Promise that resolves with the Card data if the request is successful.
 * Otherwise, returns null.
 * @throws {Error} Throws an error if the request to the API fails.
 */
export const getCard = async(cardID) => {
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_CARDS
      + cardID;
    const response = await fetch(url, {
        method: 'GET',
      }
    );
    if (response.ok) {
      const card = await response.json();
      return card;
    } else {
      console.error('Failed to fetch Card ID ',cardID, '. Status: ', response.status, '. Details: ', response.detail);
      return null;
    };

  } catch (error) {
    console.error('Error in get Card:', error);
    throw error;
  };
};


/**
 * Makes a PATCH request to update a specific field of a Card.
 * @param {string} id - The ID of the Card to be updated.
 * @param {string} fieldName - The name of the field to be updated.
 * @param {any} fieldValue - The new value to be assigned to the field.
 * @returns {Promise} - A promise that resolves with the new value in the field. On rejection returns null.
 * @throws {Error} - If the PATCH request is not successful.
 */
export const updateCardField = async (id, fieldName, fieldValue) => {
  try {
      const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                  + process.env.REACT_APP_PATH_CARDS
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
      });

      if (response.ok) {
          const requestCard = await response.json();
          return requestCard[fieldName];
      } else {
          console.warn(`Failed to update the '${fieldName}' field in Card.`);
          return null;
      };

  } catch (error) {
      console.error(`Error while making the PATCH request for the '${fieldName}' field in Card:`, error.message);
      console.debug(error);
      throw error;
  };
};

/**
 * Deletes a card by its ID.
 *
 * @param {string} cardID - The ID of the card to be deleted.
 * @returns {boolean} Returns true if the card was deleted successfully, otherwise returns false.
 */
export const deleteCard = async(cardID) => {
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_CARDS
      + cardID;

    const csrfToken = Cookies.get("csrftoken");
    const response = await fetch(url,{
      method: 'DELETE',
      credentials: 'same-origin',
          headers: {
              'Content-Type': 'application/json',
              'X-CSRFToken': csrfToken,
          },
    });
    if (response.ok) {
      console.info(`Card ${cardID} deleted successfully`);
    } else {
      const mns = `Failed to delete Card with ID ${cardID}. Status: ${response.status}`
      console.error(mns);
      console.error(mns, '. Details: ', response.detail);
      return false;
    };

  } catch (error) {
    const mns = 'An unexpected error ocurred wihle trying to delete the Card'
    console.error(`${mns}: `, error);
    throw error;
  };
};
