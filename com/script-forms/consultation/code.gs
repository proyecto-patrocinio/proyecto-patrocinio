/**
 * Triggered when a Google Form is submitted. 
 * Retrieves the authentication token from script properties and sends a POST request
 * to the specified server API URL with form response data.
 *
 * @param {Object} e - The form submit event object.
 */
function onFormSubmit(e) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const apiToken = scriptProperties.getProperty('TOKEN');
  const apiURL = scriptProperties.getProperty('FORM_API_URL');

  responseList = e.response.getItemResponses().map((preg) => preg.getResponse());

  var consultJson = {
    "client": responseList[0],
    "tag": responseList[1],
    "description": responseList[2],
    "opponent": responseList[3],
  };


  token = "Token " + apiToken
  var options = {
    "method": 'post',
    "headers" : {
      "Authorization" : token,
      "Content-Type": 'application/json',
    },
    "payload": JSON.stringify(consultJson)
  };
  
  UrlFetchApp.fetch(apiURL, options);
}
