function onFormSubmit(e) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const apiUrl = scriptProperties.getProperty('SERVER_URL');
  const apiToken = scriptProperties.getProperty('TOKEN');

  response_list = e.response.getItemResponses().map((preg) => preg.getResponse());

  var consult_json = {
    "client": response_list[0],
    "tag": response_list[1],
    "description": response_list[2],
    "opponent": response_list[3],
  };

  token = "Token " + apiToken
  var options = {
    "method": 'post',
    "headers" : {
       "Authorization" : token
    },
    "Content-Type": 'application/json',
    "payload": JSON.stringify(consult_json)
  };
  
  UrlFetchApp.fetch(apiUrl, options);
}