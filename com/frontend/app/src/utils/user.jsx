/**
 * Fetch user data by token from the API.
 *
 * @param {string} token - The authentication token for the user.
 * @returns {Promise<object>} A promise that resolves to the user data or rejects with an error.
 */
export async function getDataUserByID(token) {
    try {
      const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
        + process.env.REACT_APP_PATH_USER_BY_TOKEN
        + token;
        console.log(url)
      const response = await fetch(url,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Token ${token}`
            },
          });
      if (response.ok) {
        const user = await response.json();
        return user;
      } else {
        console.error('Failed to fetch User by token:', response.status);
        throw new Error('Failed to fetch User by token');
      }
    } catch (error) {
      console.error('Error while try to get User by token:', error);
      throw error;
    }
};