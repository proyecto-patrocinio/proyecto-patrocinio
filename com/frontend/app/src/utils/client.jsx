/**************************************************************************
* This module houses essential functions for interacting with client data. *
***************************************************************************/
import Cookies from "js-cookie";


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

        const token = window.localStorage.getItem('loggedCaseManagerUser');
        const response = await fetch(url, {
          method: 'GET',
          headers: {'Authorization': `Token ${token}`}
      });

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

      const token = window.localStorage.getItem('loggedCaseManagerUser');
      const response = await fetch(url, {
        method: 'GET',
        headers: {'Authorization': `Token ${token}`}
    });

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

    const csrfToken = Cookies.get("csrftoken");
    const token = window.localStorage.getItem('loggedCaseManagerUser');
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Token ${token}`
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

    const csrfToken = Cookies.get("csrftoken");
    const token = window.localStorage.getItem('loggedCaseManagerUser');
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(clientData)
    });

    if (response.ok) {
      const client = await response.json();
      return client;
    } else {
      const mns = 'Failed to update a new Client.';
      console.error(mns, " Status: ", response.status);
      throw new Error(mns);
    };

  } catch (error) {
    console.error('Error while try to update a Client: ', error);
    throw error;
  };
};


export async function addPhoneNumer(phone){
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_TEL;

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
      body: JSON.stringify(phone)
    });

    if (response.ok) {
      const phone = await response.json();
      console.info(`Phone with ID ${phone.id} is added successfuly.`)
      return phone;
    } else {
      const mns = 'Failed to create a new Phone Number.';
      console.error(mns, " Status: ", response.status);
      throw new Error(mns);
    };

  } catch (error) {
    console.error('Error while try to create a Phone Number: ', error);
    throw error;
  };
};


export async function deletePhoneNumer(phone){
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_TEL
      + phone.id + '/';

    const csrfToken = Cookies.get("csrftoken");
    const token = window.localStorage.getItem('loggedCaseManagerUser');
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'X-CSRFToken': csrfToken,
        'Authorization': `Token ${token}`
      }
    });

    if (response.ok) {
      console.info(`Phone with ID ${phone.id} is deleted successfuly.`)
    } else {
      const mns = 'Failed to delete Phone Number.';
      console.error(mns, " Status: ", response.status);
      throw new Error(mns);
    };

  } catch (error) {
    console.error('Error while try to delete Phone Number: ', error);
    throw error;
  };
};


/**
 * Adds patrimony data for a client.
 *
 * @param {number} idClient - The ID of the client.
 * @param {Object} patrimonyData - The patrimony data to be added.
 * @returns {Promise<Object>} The added patrimony data.
 */
export async function addPatrimony(idClient, patrimonyData){
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_PATRIMONY;

    const patrimony = {
      "employment": patrimonyData.employment,
      "salary": patrimonyData.salary,
      "other_income": patrimonyData.other_income,
      "amount_other_income": patrimonyData.amount_other_income,
      "amount_retirement": patrimonyData.amount_retirement,
      "amount_pension": patrimonyData.amount_pension,
      "vehicle": patrimonyData.vehicle,
      "client": idClient,
      "id": idClient
    };

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
      body: JSON.stringify(patrimony)
    });

    if (response.ok) {
      const patrimony = await response.json();
      console.info(`Patrimony data for user ID ${idClient} is added successfuly.`)
      return patrimony;
    } else {
      const mns = 'The patrimony data could not be added.';
      console.error(mns, " Status: ", response.status);
      throw new Error(mns);
    };

  } catch (error) {
    console.error('Error while try to add patrimony data: ', error);
    throw error;
  };
};


/**
 * Updates patrimony data for a client.
 *
 * @param {number} idClient - The ID of the client.
 * @param {Object} patrimonyData - The updated patrimony data.
 * @returns {Promise<Object>} The updated patrimony data.
 */
export async function updatePatrimony(idClient, patrimonyData){
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_PATRIMONY
      + idClient + "/";

    const patrimony = {
      "employment": patrimonyData.employment,
      "salary": patrimonyData.salary,
      "other_income": patrimonyData.other_income,
      "amount_other_income": patrimonyData.amount_other_income,
      "amount_retirement": patrimonyData.amount_retirement,
      "amount_pension": patrimonyData.amount_pension,
      "vehicle": patrimonyData.vehicle,
      "id": idClient
    };

    const csrfToken = Cookies.get("csrftoken");
    const token = window.localStorage.getItem('loggedCaseManagerUser');
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(patrimony)
    });

    if (response.ok) {
      const patrimony = await response.json();
      console.info(`Patrimony data for user ID ${idClient} is updated successfuly.`)
      return patrimony;
    } else {
      const mns = 'The Patrimony data could not be updated.';
      console.error(mns, " Status: ", response.status);
      throw new Error(mns);
    };

  } catch (error) {
    console.error('Error while try to update patrimony data: ', error);
    throw error;
  };
};


/**
 * Get patrimony data for a client.
 *
 * @param {number} idClient - The ID of the client.
 * @returns {Promise<Object|null>} The patrimony data or null if not found.
 */
export async function getPatrymony(idClient){
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_PATRIMONY
      + idClient + "/";

    const token = window.localStorage.getItem('loggedCaseManagerUser');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`
      },
    });

    if (response.ok) {
      const patrimony = await response.json();
      return patrimony;
    } else {
      return null;
    };

  } catch (error) {
    console.error('Error while try to get patrimony data: ', error);
    throw error;
  };
};


/**
 * Creates a new family by sending a POST request to the API.
 *
 * @param {Object} family - The family data to be added.
 * @returns {Promise<Object>} - A promise that resolves to the added family data.
 * @throws {Error} - If there is an error during the request or if the response is not okay.
 */
export async function createFamily(family){
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_FAMILY;

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
      body: JSON.stringify(family)
    });

    if (response.ok) {
      const family = await response.json();
      console.info(`Family data with ID ${family.id} is added successfuly.`)
      return family;
    } else {
      const mns = 'The family data could not be added.';
      console.error(mns, " Status: ", response.status);
      throw new Error(mns);
    };

  } catch (error) {
    console.error('Error while try to add family data: ', error);
    throw error;
  };
};


/**
 * Updates an existing family by sending a PUT request to the API.
 *
 * @param {Object} family - The updated family data.
 * @returns {Promise<{ success: boolean, content: Object }>} - A promise that resolves to an object indicating the success of the update and the updated family data.
 * @throws {Error} - If there is an error during the request or if the response is not okay.
 */
export async function updateFamily(family){
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_FAMILY
      + family.id + "/";

    const csrfToken = Cookies.get("csrftoken");
    const token = window.localStorage.getItem('loggedCaseManagerUser');
    const response = await fetch(url, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify(family)
    });

    if (response.ok) {
      const family = await response.json();
      console.info(`Family data with ID ${family.id} is updatted successfuly.`)
      return {success:true, content:family};;
    } else {
      if (response.status === 404) {
        return {success:false, content:null};
    }
      const mns = 'The family data could not be updatted.';
      console.error(mns, " Status: ", response.status);
      throw new Error(mns);
    };

  } catch (error) {
    console.error('Error while try to update family data: ', error);
    throw error;
  };
};


/**
 * Deletes a child by sending a DELETE request to the API.
 *
 * @param {Object} child - The child data to be deleted.
 * @throws {Error} - If there is an error during the request or if the response is not okay.
 */
export async function deleteChild(child){
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_TEL
      + child.id + '/';

    const csrfToken = Cookies.get("csrftoken");
    const token = window.localStorage.getItem('loggedCaseManagerUser');
    const response = await fetch(url, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'X-CSRFToken': csrfToken,
        'Authorization': `Token ${token}`
      }
    });

    if (response.ok) {
      console.info(`Child with ID ${child.id} is deleted successfuly.`)
    } else {
      const mns = 'Failed to delete Child.';
      console.error(mns, " Status: ", response.status);
      throw new Error(mns);
    };

  } catch (error) {
    console.error('Error while try to delete Child: ', error);
    throw error;
  };
};


/**
 * Adds a new child by sending a POST request to the API.
 *
 * @param {Object} child - The child data to be added.
 * @returns {Promise<Object>} - A promise that resolves to the added child data.
 * @throws {Error} - If there is an error during the request or if the response is not okay.
 */
export async function addChild(child){
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_CHILDREN;

    const childFormatted = {
      "first_name": child.first_name,
      "last_name":child.last_name,
      "id_type": child.id_type,
      "sex": child.Authorizationsex,
      "birth_date": child.birth_date.split('T')[0],  // YYYY-MM-DD
      "address": child.address,
      "id_value": child.id_value,
      "locality": child.locality.id,
      "family_client_user": child.family_client_user
  }

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
      body: JSON.stringify(childFormatted)
    });

    if (response.ok) {
      const child = await response.json();
      console.info(`Child data with ID ${child.id} is added successfuly.`)
      return child;
    } else {
      const mns = 'The child data could not be added.';
      console.error(mns, " Status: ", response.status);
      throw new Error(mns);
    };

  } catch (error) {
    console.error('Error while try to add child data: ', error);
    throw error;
  };
};
