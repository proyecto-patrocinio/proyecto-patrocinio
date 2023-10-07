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
        const client = await response.json();
        return client;
      } else {
        console.error('Failed to fetch client:', response.status);
        throw new Error('Failed to fetch client');
      }
    } catch (error) {
      console.error('Error while try to get client:', error);
      throw error;
    }
};


/**
 * Fetches all clients from the API.
 *
 * @returns {Promise<Object>} A Promise that resolves with the list of clients if the request is successful.
 * @throws {Error} Throws an error if the request to the API fails.
 */
export async function getClientList() {
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_CLIENTS;
    const response = await fetch(url);
    if (response.ok) {
      const client = await response.json();
      return client;
    } else {
      console.error('Failed to fetch list of client:', response.status);
      throw new Error('Failed to fetch list of client');
    }
  } catch (error) {
    console.error('Error while try to get list of client:', error);
    throw error;
  }
};


/**
 * Creates a new client by sending a POST request to the API.
 *
 * @param {object} clientData - The data for the new client.
 * @returns {Promise<object>} A promise that resolves to the created client.
 * @throws {Error} If the creation fails, an error is thrown.
 */
export async function createClient(clientData) {
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_CLIENTS;
    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
      });
    if (response.ok) {
      const client = await response.json();
      return client;
    } else {
      const mns = 'Failed to create a new client.';
      console.error(mns, " Status: ", response.status);
      throw new Error(mns);
    };
  } catch (error) {
    console.error('Error while try to create a client:', error);
    throw error;
  };
};


/**
 * Deletes a client by sending a DELETE request to the API.
 *
 * @param {string} clientID - The ID of the client to be deleted.
 * @returns {Promise<object>} A promise that response.
 * @throws {Error} If the deletion fails, an error is thrown.
 */
export async function deleteClient(clientID) {
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_CLIENTS
      + clientID + '/';
    const response = await fetch(
      url,
      {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (response.ok) {
      return response;
    } else {
      const mns = 'Failed to delete client.'
      console.error(mns, " Status: ", response.status);
      throw new Error(mns);
    }
  } catch (error) {
    console.error('Error while try to delete a client: ', error);
    throw error;
  }
};


/**
 * Updates an existing client by sending a PUT request to the API.
 *
 * @param {object} clientData - The updated data for the client.
 * @returns {Promise<object>} A promise that resolves to the updated client.
 * @throws {Error} If the update fails, an error is thrown.
 */
export async function updateClient(clientData) {
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_CLIENTS
      + clientData.id
      + "/";
    const response = await fetch(
      url,
      {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData)
      });
    if (response.ok) {
      const client = await response.json();
      return client;
    } else {
      const mns = 'Failed to update a new client.';
      console.error(mns, " Status: ", response.status);
      throw new Error(mns);
    };
  } catch (error) {
    console.error('Error while try to update a client: ', error);
    throw error;
  };
};
