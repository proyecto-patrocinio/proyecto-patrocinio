/***********************************************************************************
* This module contains functions for interacting with the calendar and events API. *
************************************************************************************/
import Cookies from "js-cookie";


/**
 * Fetches the calendar data for a specific card ID.
 *
 * @param {number} cardID - The ID of the card to get the calendar for.
 * @returns {Promise<Object>} - A promise that resolves to the fetched calendar data.
 * @throws {Error} - If the fetch operation fails.
 */
export async function getCalendarByCard(cardID) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_CALENDAR
            + `?card_id=${cardID}`;
        const token = window.localStorage.getItem('loggedCaseManagerUser');
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Authorization': `Token ${token}`}
        });
        if (response.ok) {
            const calendar = await response.json();
            return  calendar;
        } else {
            const mns =`Falló la obtención del calendario para la consulta con ID ${cardID}.`
            console.error(mns, " Status code: ", response.status);
            throw new Error(mns);
        }
        } catch (error) {
        console.error(`Unexpected error while try to fetch Calendar for Card ID ${cardID}:`, String(error));
        throw error;
    }
};


/**
 * Fetches the events for a specific board ID.
 *
 * @param {number} boardID - The ID of the board to get events for.
 * @returns {Promise<Object>} - A promise that resolves to the fetched events data.
 * @throws {Error} - If the fetch operation fails.
 */
export async function getEventsByBoard(boardID) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_CALENDAR_EVENT
            + `?board_id=${boardID}`;
        const token = window.localStorage.getItem('loggedCaseManagerUser');
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Authorization': `Token ${token}`}
        });
        if (response.ok) {
            const events = await response.json();
            return events;
        } else {
            const mns =`Falló la obtención de eventos para la pizzara co ID ${boardID}.`
            console.error(mns, " Status code: ", response.status);
            throw new Error(mns);
        }
        } catch (error) {
        console.error(`Unexpected error while try to fetch Events for Board ID ${boardID}:`, String(error));
        throw error;
    }
};


/**
 * Creates a new event.
 *
 * @param {Object} eventData - The data for the new event.
 * @returns {Promise<Object>} - A promise that resolves to the created event data.
 * @throws {Error} - If the creation operation fails.
 */
export async function createEvent(eventData) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_CALENDAR_EVENT;

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
                body: JSON.stringify(eventData)
            });
        if (response.ok) {
            const event = await response.json();
            return event;
        } else {
            const mns = 'Falló la creación del evento.';
            console.error(mns, " Status: ", response.status);
            throw new Error(mns);
        };
        } catch (error) {
        console.error('Error while try to create a Event:', String(error));
        throw error;
    };
};


/**
 * Deletes an event with the specified ID.
 *
 * @param {number} eventID - The ID of the event to delete.
 * @returns {Promise<Response>} - A promise that resolves to the delete operation response.
 * @throws {Error} - If the delete operation fails.
 */
export async function deleteEvent(eventID) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_CALENDAR_EVENT
            + eventID + '/';

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
            const mns = 'Falló la eliminación del evento.'
            console.error(mns, " Status: ", response.status);
            throw new Error(mns);
        }
    } catch (error) {
        console.error('Error while try to delete a Event: ', error);
        throw error;
    }
};
