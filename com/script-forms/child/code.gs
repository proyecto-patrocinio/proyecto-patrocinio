const ID_EXCEL = '1f2F2CUQNtdbj_xzIPiaxbFYlDysxdiwtYlBh68AO3bc';
FORM_ID = "14tjyqssjA5XzfNmi87oBuOO7dGRPcIN8luOS6ggeDQU"
//Indices de respuesta del formulario
const INDEX_NATIONALITY_RESPONSE = 7;
const INDEX_PROVINCE_RESPONSE = INDEX_NATIONALITY_RESPONSE +1;
const INDEX_LOCALITY_RESPONSE = INDEX_PROVINCE_RESPONSE +1;

function onFormOpen(e){
  FormApp.openById(FORM_ID).setConfirmationMessage("Se ha registrado su respuesta. Para registrar otro hijo/a, seleccione 'Enviar otra respuesta'.\n\n \
  Si ya ha terminado de registrar a todos sus hijos, el formulario ha sido completado.");
}

function onFormSubmit(e) {
  /* TEST
  let response = FormApp.getActiveForm().getResponses()[9].getItemResponses();
  response_list = response.map((preg) => preg.getResponse());
  */
  response_list = e.response.getItemResponses().map((preg) => preg.getResponse());

  response_dict = {
    id_consultant: response_list[0],
    first_name: response_list[1],
    last_name: response_list[2],
    id_type: ID_TYPE[response_list[3]],
    id_value: response_list[4],
    birth_date: response_list[5],
    sex: SEX[response_list[6]],
    locality: get_locality(response_list[INDEX_NATIONALITY_RESPONSE], response_list[INDEX_LOCALITY_RESPONSE]),
    address: response_list[10]
  }

  // Convierte el objeto a formato JSON
  let jsonBody = JSON.stringify(response_dict, null, 2);
  /* Test
  MailApp.sendEmail({
    to: email,
    subject: "Formulario",
    body: "Nuevo Hijo/a registrado:\n\n" + jsonBody,
  });
  */
  const apiUrl = 'https://406abbe5-3180-4ee1-8d90-3acd3b076c1f.mock.pstmn.io/api/clients/client/childform';
  const options = {
    method: 'post',
    'Content-Type': 'application/json',
    payload: jsonBody
  };
  
  UrlFetchApp.fetch(apiUrl, options);
  
}
