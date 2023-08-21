import { List } from "@mui/material";

const getConsultationsToAssign = async () => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                + process.env.REACT_APP_FILTER_CONSULTATIONS_WITH_STATUS
                + "REGISTERED";
        const response = await fetch(url);
        if (response.ok) {
        const data = await response.json();
        return data;
        } else {
            console.error('Failed to fetch Consultations:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error in fetch Consultations:', error);
        throw error;
    }
};

const getListBoard = async () => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                    + process.env.REACT_APP_PATH_BOARD;
        const response = await fetch(url);
        if (response.ok) {
            const board_list = await response.json();
            return board_list;
        } else {
            console.error('Failed to fetch board:', response.status);
            throw new Error('Failed to fetch board');
        }
    } catch (error) {
        console.error('Error in get list board:', error);
        throw error;
    }
}

const getRequestCards = async () => {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                    + process.env.REACT_APP_PATH_REQUEST_CARDS;
        const response = await fetch(url);
        if (response.ok) {
            const request_card_list = await response.json();
            return request_card_list;
        } else {
            console.error('Failed to fetch Request Card: ', response.status);
            throw new Error('Failed to fetch Request Card');
        }
    } catch (error) {
        console.error('Error in get Request Card:', error);
        throw error;
    }
}
