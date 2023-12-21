/*****************************************************************************************
 * Funciones para establecer las propiedades del script                                  *
 * Documentacion:  https://developers.google.com/apps-script/guides/properties?hl=es-419 *
******************************************************************************************/

/**
 * Updates script properties with the provided token, user, and password.
 *
 * @param {string} token - The authentication token to be stored.
 * @param {string} user - The username to be stored.
 * @param {string} password - The password to be stored.
 */
function updateProperties(token, user, password) {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty('TOKEN', token);
    scriptProperties.setProperty('USER', user);
    scriptProperties.setProperty('PASSWORD', password);

  } catch (err) {
    console.log('Update Properties Failed With Error: %s', err.message);
  }
}

/**
 * Parses a JSON string and retrieves the value associated with the key "key".
 *
 * @param {string} jsonString - The JSON string to be parsed.
 * @returns {string} - The value associated with the key "key".
 */
function getToken(jsonString) {
 
  try {
    // Parsea el string como JSON
    var jsonData = JSON.parse(jsonString);
    
    // Obtiene el valor asociado con la clave "key"
    var valorKey = jsonData.key;

    return valorKey;
    
  } catch (error) {
    Logger.log("Error al procesar el string JSON: " + error.message);
  }
}

/**
 * This feature is used by an activator to update credentials automatically.
 */
function updateCredentials(){
  const scriptProperties = PropertiesService.getScriptProperties();
  const user = scriptProperties.getProperty('USER');
  const password = scriptProperties.getProperty('PASSWORD')
  login(user, password);
}

/**
 * Sends a POST request to an authentication API with the provided user and password.
 * Parses the response to obtain a token and updates script properties.
 *
 * @param {string} user - The username for authentication.
 * @param {string} password - The password for authentication.
 * @returns {boolean} True if no have a error.
 */
function login(user, password) {
  const scriptProperties = PropertiesService.getScriptProperties();
  apiUrl = scriptProperties.getProperty('LOGIN_API_URL');
  data={
    "username": user,
    "email": "",
    "password": password
  }
  var options = {
    "method": 'post',
    "headers" : {
      "Content-Type": 'application/json',
    },
    "payload": JSON.stringify(data)
  };
  
  response = UrlFetchApp.fetch(apiUrl, options);
  token = getToken(response.toString());
  updateProperties(token, user, password);
  return true;
}

/**
 * Triggered when a Google Form is open.
 * Creates a custom menu in the Google Form interface.
 * Adds an option to update credentials and api urls by calling the showMenu function.
 */
function onOpen() {
  var ui = FormApp.getUi();

  ui.createMenu('Menu')
    .addItem('Configure Parameters', 'showMenu')
    .addItem('Refresh Token', 'updateCredentials')
    .addToUi();
}

/**
 * Displays a modal dialog prompting the user to enter parameters.
 */
function showMenu() {
  var htmlOutput = HtmlService
    .createHtmlOutputFromFile('Index')
    .setWidth(300)
    .setHeight(400);

  FormApp.getUi().showModalDialog(htmlOutput, 'Enter parameters');
}


function setURLS(login_api_url, form_api_url) {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    scriptProperties.setProperty('LOGIN_API_URL', login_api_url);
    scriptProperties.setProperty('FORM_API_URL', form_api_url);

  } catch (err) {
    console.log('Update Properties Failed With Error: %s', err.message);
  }
}

function configureForm(user, password, login_api_url, form_api_url) {
  setURLS(login_api_url, form_api_url);
  login(user, password);
}
