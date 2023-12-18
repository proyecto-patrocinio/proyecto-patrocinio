/*****************************************************************************************
 * Functions to set script properties and create Menu                                    *
 * Documentacion:  https://developers.google.com/apps-script/guides/properties?hl=es-419 *
******************************************************************************************/

// const SERVER_API_FORM_URL = "myurl/api/subitem" // URL Defined in Constants.gs

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

    scriptProperties.setProperties({
        'TOKEN': token,
        'USER': user,
        'PASSWORD': password
    });

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
  apiUrl = "https://proyecto-patrocinio.fcefyn.unc.edu.ar/api/auth/login/"
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
 * Adds an option to update credentials by calling the showMenu function.
 */
function onOpen() {
  var ui = FormApp.getUi();

  ui.createMenu('Menu')
    .addItem('Update Credentials', 'showMenu')
    .addToUi();
}

/**
 * Displays a modal dialog prompting the user to enter parameters.
 */
function showMenu() {
  var htmlOutput = HtmlService
    .createHtmlOutputFromFile('Index')
    .setWidth(300)
    .setHeight(300);

  FormApp.getUi().showModalDialog(htmlOutput, 'Enter parameters');
}