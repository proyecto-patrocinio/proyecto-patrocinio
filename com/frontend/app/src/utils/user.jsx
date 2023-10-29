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

export function loginUser(dataUser, onLoginSuccess, onLoginError){
  const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
  + process.env.REACT_APP_PATH_LOGIN ;
  
  const request = new XMLHttpRequest();
  request.open('POST', url);
  request.setRequestHeader( 'Content-Type', 'application/json');
  
  request.onreadystatechange = async (event_data) => { // Call a function when the state changes.
    if (request.readyState === XMLHttpRequest.DONE ) {
      if( request.status === 200){
        // Storage token session
        const resonse = event_data.currentTarget.response;
        const token = JSON.parse( resonse).key;
        window.localStorage.setItem("loggedCaseManagerUser", token);
        
        // Update user context
        console.log("User context", request);
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


export function logoutUser(){
  const token = window.localStorage.getItem('loggedCaseManagerUser');
  const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
  + process.env.REACT_APP_PATH_LOGOUT ;

  const request = new XMLHttpRequest();
  request.open('POST', url);
  request.setRequestHeader( 'Content-Type', 'application/json');
  request.setRequestHeader( 'Authorization', `Token ${token}`);
  
  request.onreadystatechange = async (event_data) => {
    // Call a function when the state changes.
    if (request.readyState === XMLHttpRequest.DONE ) {
      if( request.status !== 200){
        console.info('Logout Success');
      } else{
        console.error('Logout Failure');
      }
    }
  };

  request.send();
};
