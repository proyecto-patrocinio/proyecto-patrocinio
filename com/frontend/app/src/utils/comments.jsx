
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
        const response = await fetch(url);
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
        const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
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
