import { List } from "@mui/material";

/**
 * Fetches cards that are to be assigned based on CREATED status.
 * @returns {Promise} A promise that resolves to the fetched data or an error.
 */
const getCardsToAssign = async () => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                + process.env.REACT_APP_FILTER_CARD_WITH_STATUS
                + "CREATED";
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('Failed in fetch Cards with status CREATED:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Failed in fetch Cards with status CREATED:', response.status);
        console.debug(error);
        throw error;
    }
};

/**
 * Fetches the list of boards.
 * @returns {Promise} A promise that resolves to the fetched board list or an error.
 */
const getListBoard = async () => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                    + process.env.REACT_APP_PATH_BOARD;
        const response = await fetch(url);
        if (response.ok) {
            const board_list = await response.json();
            return board_list;
        } else {
            throw new Error('Failed to fetch board');
        }
    } catch (error) {
        console.error('Failed to fetch board:', response.status);
        console.debug(error);
        throw error;
    }
}

/**
 * Fetches the list of request cards.
 * @returns {Promise} A promise that resolves to the fetched request card list or an error.
 */
const getRequestCards = async () => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                    + process.env.REACT_APP_PATH_REQUEST_CARDS;
        const response = await fetch(url);
        if (response.ok) {
            const request_card_list = await response.json();
            return request_card_list;
        } else {
            throw new Error('Failed to fetch Request Card');
        }
    } catch (error) {
        console.error('Failed to fetch Request Card: ', response.status);
        console.debug(error);
        throw error;
    }
}
