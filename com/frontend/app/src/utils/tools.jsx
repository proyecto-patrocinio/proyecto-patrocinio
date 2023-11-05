import { getClientList } from "./client";


/**
 * Get a mapping of client's DNI (ID Value) to client ID.
 * @returns {Promise<object>} An object that maps DNI numbers to client IDs.
 */
export async function getClientDNI2ID () {
    const clients = await getClientList()
    const clientDNItoIdMapping = {};
    clients.forEach((client) => {
    clientDNItoIdMapping[client.id_value] = client.id;
    });
    return clientDNItoIdMapping;
};


/**
 * Get a mapping of client ID to DNI (ID value).
 * @returns {Promise<object>} An object that maps client IDs to DNI numbers.
 */
export async function getClientID2DNI () {
    const clients = await getClientList()
    const clientDNItoIdMapping = {};
    clients.forEach((client) => {
    clientDNItoIdMapping[client.id] = client.id_value;
    });
    return clientDNItoIdMapping;
};


/**
 * Get Random Integer Number
 * @param {Number} max.
 * @param {Number} min. Default value is 1.
 * @returns Random number
 */
export function getRandomNumber(max, min=1) {
    const randint = Math.floor(Math.random() * (max-min)) + min;
    return randint;
};

/**
 * Format a timestamp into a human-readable date and time string.
 *
 * @param {string} timestamp - The timestamp in ISO 8601 format.
 * @returns {string} A formatted date and time string (e.g., "09/12/2023 02:33:01 AM").
 *
 * @example
 * const timestamp = "2023-09-12T02:33:01.377806Z";
 * const formattedDateTime = formatTimestamp(timestamp);
 * console.log(formattedDateTime); // Output: "09/12/2023 02:33:01 AM"
 */
export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return `${formattedDate} ${formattedTime}`;
};


/* Formats a Date object to 'YYYY-MM-DD' format.
*
* @param {Date} date - The Date object to format.
* @returns {string} The formatted date in 'YYYY-MM-DD' format.
*/
export function formatDateToString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zeros if necessary
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zeros if necessary

    return `${year}-${month}-${day}`;
};

export function deleteCookie(name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};
