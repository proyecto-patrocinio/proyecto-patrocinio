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

    const request = new XMLHttpRequest();
    request.open('PATCH', url);
    request.setRequestHeader( 'Content-Type', 'application/json');

    const promise = new Promise((resolve, reject) => {
      request.onreadystatechange = () => {// Call a function when the state changes.
        if (request.readyState === XMLHttpRequest.DONE) {
          if (request.status === 200) {
            resolve(true);
          } else {
            console.error('Failed to PATCH card, with ID', cardID, '. Status: ', request.status);
            resolve(false);
          }
        }
      };
    });

    request.send(
      JSON.stringify({
          "panel": destinyPanelID,
      })
    );

    return await promise;

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
    const response = await fetch(url);
    if (response.ok) {
      const card = await response.json();
      return card;
    } else {
      console.error('Failed to fetch Card ID ',cardID, '. Status: ', response.status, '. Details: ', response.detail);
      return null;
    }
  } catch (error) {
    console.error('Error in get Card:', error);
    throw error;
  }
}


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
          const requestCard = await response.json();
          return requestCard[fieldName];

      } else {
          console.warn(`Failed to update the '${fieldName}' field in Card.`);
          return null;
      }
  } catch (error) {
      console.error(`Error while making the PATCH request for the '${fieldName}' field in Card:`, error.message);
      console.debug(error);
      throw error;
  }
};

