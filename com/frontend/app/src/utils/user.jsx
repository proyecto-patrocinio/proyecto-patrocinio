import Cookies from "js-cookie";

/**
 * Fetch user data by token from the API.
 *
 * @param {string} token - The authentication token for the user.
 * @returns {Promise<object>} A promise that resolves to the user data or rejects with an error.
 */
export async function getDataUserByToken(token) {
    try {
      const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
        + process.env.REACT_APP_PATH_USER_BY_TOKEN
        + token;
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


/**
 * Sends a login request to the API to authenticate a user with the provided data.
 *
 * @param {object} dataUser - An object containing user login data, including username and password.
 * @param {function} onLoginSuccess - A callback function to be called upon successful login. It receives the user data.
 * @param {function} onLoginError - A callback function to be called when there is an error during login. It receives an error message.
 */
export function loginUser(dataUser, onLoginSuccess, onLoginError){
  const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
  + process.env.REACT_APP_PATH_LOGIN ;

  const request = new XMLHttpRequest();
  request.open('POST', url);
  request.setRequestHeader('Content-Type', 'application/json');

  request.onreadystatechange = async (event_data) => { // Call a function when the state changes.
    if (request.readyState === XMLHttpRequest.DONE ) {
      if( request.status === 200){
        // Storage token session
        const resonse = event_data.currentTarget.response;
        const token = JSON.parse( resonse).key;
        window.localStorage.setItem("loggedCaseManagerUser", token);

        // Update user context
        const user = await getDataUserByToken(token);
        onLoginSuccess(user);
      }
      else if( request.status !== 400 ){
        const errorMensage = "Unable to login. Please try again later.";
        onLoginError(errorMensage);
      }
      else {
        const errorMensage = "The username or password is incorrect.";
        onLoginError(errorMensage);
      }
    }
  };

  //send data to API
  request.send(
    JSON.stringify({
      "username": dataUser.username,
      "email": "",
      "password": dataUser.password,
    }));
};


/**
 * Logs out the user by sending a logout request to the API.
 *
 * @returns {Promise<boolean>} A promise that resolves to true if the logout is successful, and false otherwise.
 */
export async function logoutUser(){
    const token = window.localStorage.getItem('loggedCaseManagerUser');
    const csrfToken = Cookies.get("csrftoken");
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
    + process.env.REACT_APP_PATH_LOGOUT ;

    try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'X-CSRFToken': csrfToken,
        'Authorization': `Token ${token}`,
      },
    })
    if(response.ok) {
      console.info('Successful logout');
      return true;
    } else {
      console.info('Logout Failure');
      return false;
    }
  } catch (error) {
    console.info('Logout Failure');
    return false;
  }
};


/**
 * Sends a confirmation email to the specified email address.
 *
 * @param {string} email - The email address to which the confirmation email will be sent.
 * @returns {Promise<Object>} A Promise that resolves with an object containing the result of the email sending.
 * @property {boolean} ok - Indicates whether the email was sent successfully (true) or not (false).
 * @property {string} detail - A message providing details about the result of the email sending.
 */
export async function sendConfirmationEmail(email){
  const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
  + process.env.REACT_APP_PATH_RESEND_EMAIL;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: email})
    })
    if(response.ok) {
      return{ok: true, detail: 'Successful send email.'};
    } else {
      return{ok: false, detail: 'Failed to send email. Server response not okay.'};
    };
    
  } catch (error) {
    const mns = `Error while sending the email: ${error}`
    return{ok: false, detail: mns};
  }
};



/**
 * Sends a reset password email to the specified email address.
 * @param {string} email - The email address to send the reset password email to.
 * @returns {Object} An object containing the result of the email sending operation.
 * - ok (boolean): Indicates whether the email was sent successfully.
 * - detail (string): A message describing the result of the operation.
 */
export async function sendResetPasswordEmail(email){
  const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
  + process.env.REACT_APP_PATH_RESET_PASSWORD;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({email: email})
    })
    if(response.ok) {
      return{ok: true, detail: 'Successful send email.'};
    } else {
      return{ok: false, detail: 'Failed to send email. Server response not okay.'};
    };
    
  } catch (error) {
    const mns = `Error while sending the email: ${error}`
    return{ok: false, detail: mns};
  }
};


/**
 * Sends a request to change the user's password.
 *
 * @param {string} password - The new password.
 * @param {string} uid - User identifier.
 * @param {string} token - Token for the password reset request.
 * @returns {Object} An object with 'ok' indicating success or failure and 'detail' providing details.
 * @throws {string} Throws an error message if the request fails.
 */
export async function sendChangePassword(password, uid, token) {
  const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
  + process.env.REACT_APP_PATH_RESET_PASSWORD
  + `${uid}/${token}/`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "new_password1": password,
        "new_password2": password,
        "uid": uid,
        "token": token
    })
    })
    if(response.ok) {
      return{ok: true, detail: 'Successful send email.'};
    } else {
      const responseJson = await response.json();
      const message = responseJson?.detail
      || responseJson?.new_password2
      || responseJson?.new_password1
      || "uid - " + responseJson?.uid
      || "token - " + responseJson?.token
      || JSON.stringify(responseJson)
      const responseMessage = String(message)
      return{ok: false, detail: responseMessage};
    };

  } catch (error) {
    const mns = `Error while sending the email: ${error}`
    return{ok: false, detail: mns};
  };
};
