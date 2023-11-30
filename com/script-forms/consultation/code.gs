function onFormSubmit(e) {
  response_list = e.response.getItemResponses().map((preg) => preg.getResponse());

  var consult_json = {
    "client": response_list[0],
    "tag": response_list[1],
    "description": response_list[2],
    "opponent": response_list[3],
  };

  var apiUrl = 'https://535cca38-846c-44ee-a1f0-90aec9a6b8cb.mock.pstmn.io/api/consultations/consultation/form';
  var options = {
    "method": 'post',
    "Content-Type": 'application/json',
    "payload": JSON.stringify(consult_json)
  };
  
  UrlFetchApp.fetch(apiUrl, options);
}