/**************************************************************************
* This module houses essential functions for interacting with client data. *
***************************************************************************/


/**
 * Fetches data for a specific client from the API.
 *
 * @param {number} clientID - The ID of the client to retrieve data for.
 * @returns {Promise<Object>} A Promise that resolves with the client data if the request is successful.
 * @throws {Error} Throws an error if the request to the API fails.
 */
export async function getDataClient(clientID) {
    try {
      const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
        + process.env.REACT_APP_PATH_CLIENTS
        + clientID;
      const response = await fetch(url);
      if (response.ok) {
        const board = await response.json();
        return board;
      } else {
        console.error('Failed to fetch client:', response.status);
        throw new Error('Failed to fetch client');
      }
    } catch (error) {
      console.error('Error while try to get client:', error);
      throw error;
    }
  }
