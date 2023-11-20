/************************************************************************
* This module contains functions for interacting with the comments API. *
*************************************************************************/

import Cookies from "js-cookie";

/**
 * Fetches all comments for consultation ID from the API.
 *
 * @returns {Promise<Object>} A Promise that resolves with the list of comments if the request is successful.
 * @throws {Error} Throws an error if the request to the API fails.
 */
export async function getCommentListByConsult(consultID) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_COMMENTS_BY_CONSULT
            + consultID;
        const token = window.localStorage.getItem('loggedCaseManagerUser');
        const response = await fetch(url, {
            method: 'GET',
            headers: {'Authorization': `Token ${token}`}
        });
        if (response.ok) {
            const comments = await response.json();
            return comments;
        } else {
            const mns =`Failed to fetch list of comments for the Consultation ID ${consultID}.`
            console.error(mns, " Status code: ", response.status);
            throw new Error(mns);
        }
        } catch (error) {
        console.error('Error while try to get list of comments:', String(error));
        throw error;
    }
};



/**
 * Creates a new Comment by sending a POST request to the API.
 *
 * @param {object} commentData - Dict with data of the comment (user, text, consultation).
 * @returns {Promise<object>} A promise that resolves to the created comment.
 * @throws {Error} If the creation fails, an error is thrown.
 */
export async function createComment(commentData) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_COMMENTS;

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
                body: JSON.stringify(commentData)
            });
        if (response.ok) {
            const comment = await response.json();
            return comment;
        } else {
            const mns = 'Failed to create a new Comment.';
            console.error(mns, " Status: ", response.status);
            throw new Error(mns);
        };
        } catch (error) {
        console.error('Error while try to create a Comment:', String(error));
        throw error;
    };
};


/**
 * Deletes a Comment by sending a DELETE request to the API.
 *
 * @param {string} commentID - The ID of the comment to be deleted.
 * @returns {Promise<object>} A promise that response.
 * @throws {Error} If the deletion fails, an error is thrown.
 */
export async function deleteComment(commentID) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_COMMENTS
            + commentID + '/';

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
            const mns = 'Failed to delete Comment.'
            console.error(mns, " Status: ", response.status);
            throw new Error(mns);
        }
    } catch (error) {
        console.error('Error while try to delete a Comment: ', error);
        throw error;
    }
};

/**
 * Updates an existing Comment by sending a PUT request to the API.
 *
 * @param {Number} id The id of the Comment.
 * @param {object} commentData - The updated data for the Comment.
 * @returns {Promise<object>} A promise that resolves to the updated Comment.
 * @throws {Error} If the update fails, an error is thrown.
 */
export async function updateComment(commentID, commentData) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_COMMENTS
            + commentID
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
            body: JSON.stringify(commentData)
            });
        if (response.ok) {
            const comment = await response.json();
            return comment;
        } else {
            const mns = 'Failed to update a Comment.';
            console.error(mns, " Status: ", response.status);
            throw new Error(mns);
        };
        } catch (error) {
        console.error('Error while try to update a Comment: ', String(error));
        throw error;
    };
};


/**
 * Uploads a file to the specified API endpoint.
 *
 * @param {object} fileData - The data representing the file to be uploaded.
 * @returns {Promise} A Promise that resolves to the uploaded file data.
 * @throws {Error} Throws an error if the file upload fails.
 */
export async function uploadFile(fileData) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_ATTACH_COMMENT_FILE;

        const csrfToken = Cookies.get("csrftoken");
        const token = window.localStorage.getItem('loggedCaseManagerUser');
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'X-CSRFToken': csrfToken,
                'Authorization': `Token ${token}`
            },
            body: fileData
            });
        if (response.ok) {
            const file = await response.json();
            return file;
        } else {
            const mns = 'Failed to upload a new File.';
            console.error(mns, " Status: ", response.status);
            console.error(mns, " Status: ", response);
            throw new Error(mns);
        };
        } catch (error) {
        console.error('Error while try to upload a File:', String(error));
        throw error;
    };
};


/**
 * Fetches the content of a document associated with a file.
 *
 * @param {number} fileID - The ID of the file to fetch the content from.
 * @returns {Promise<string>} - A Promise that resolves to the content of the file.
 * @throws {Error} - Throws an error if fetching the content fails.
 */
export async function getContentFile(fileID) {
    try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_ATTACH_COMMENT_FILE
            + fileID + '/download/';
            const token = window.localStorage.getItem('loggedCaseManagerUser');
            const response = await fetch(url, {
                method: 'GET',
                headers: {'Authorization': `Token ${token}`}
            });
        if (response.ok) {
            return response.text();
        } else {
            const mns = 'Failed to get content file.'
            console.error(mns, " Status: ", response.status);
            throw new Error(mns);
        }
    } catch (error) {
        console.error('Error while try to get content file: ', String(error));
        throw error;
    }
};


/**
 * Get the URL to download a file associated with a file ID.
 *
 * @param {number} fileID - The ID of the file for which to obtain the download URL.
 * @returns {string} - The URL for downloading the file.
 */
export function getURLtoDownloadFile(fileID) {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
            + process.env.REACT_APP_PATH_ATTACH_COMMENT_FILE
            + fileID + '/download/';
        return url;
};
