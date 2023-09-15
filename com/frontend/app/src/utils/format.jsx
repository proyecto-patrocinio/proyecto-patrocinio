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
}
