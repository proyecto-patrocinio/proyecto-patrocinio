const ID_EXCEL = '1f2F2CUQNtdbj_xzIPiaxbFYlDysxdiwtYlBh68AO3bc';
//Indices de respuesta del formulario
const INDEX_NATIONALITY_RESPONSE = 10;
const INDEX_PROVINCE_RESPONSE = INDEX_NATIONALITY_RESPONSE +1;
const INDEX_LOCALITY_RESPONSE = INDEX_PROVINCE_RESPONSE +1;

function onFormOpen(e){
  FormApp.openById("13__bFD1qzdB0EiQ_GkkhuKFaS0RsF87TWNElnwESqIA").setConfirmationMessage(`IMPORTANTE: En caso de tener hijos haga click en el siguiente link para competar el formulario. En caso contrario el formulario ha sido completado. \n\n https://docs.google.com/forms/d/e/1FAIpQLSflplcgDsMwFg4F-u-Hl-JEK3mwM2x8MRdKtFik1tIFkAW8Rw/viewform?usp=sf_link`);

}

function onFormSubmit(e) {

  /* Test
  let response = FormApp.getActiveForm().getResponses()[9].getItemResponses();
  response_list = response.map((preg) => preg.getResponse());
  */
  response_list = e.response.getItemResponses().map((preg) => preg.getResponse());

  response_dict = {
    //----------Person--------------
    first_name: response_list[0],
    last_name: response_list[1],
    id_type: ID_TYPE[response_list[2]],
    id_value: response_list[3],
    birth_date: response_list[4],
    sex: SEX[response_list[5]],
    marital_status: MARITAL_STATUS[response_list[6]],
    studies: STUDIES[response_list[7]],
    email: response_list[8],
    housing_type: HOUSING_TYPE[response_list[9]],
    locality: get_locality(response_list[INDEX_NATIONALITY_RESPONSE], response_list[INDEX_LOCALITY_RESPONSE]),
    address: response_list[13],
    postal: response_list[14],
    //----------Patrimony--------------
    employment: response_list[15],
    salary: response_list[16],
    other_income: response_list[17],
    amount_other_income: response_list[18],
    amount_retirement: response_list[19],
    amount_pension: response_list[20],
    vehicle: response_list[21],
    //----------contact--------------
    tel: String(response_list[22]).replace(" ", '').split(','),
    //----------family--------------
    partner_salary: response_list[23]
  }


  // Convierte el objeto a formato JSON
  var jsonBody = JSON.stringify(response_dict, null, 2);


  /* TEST Envía el correo electrónico
  MailApp.sendEmail({
    to: email,
    subject: "Formulario",
    body: "Nuevo formulario enviado:\n\n" + jsonBody,
  });
  */

  var apiUrl = 'https://406abbe5-3180-4ee1-8d90-3acd3b076c1f.mock.pstmn.io/api/clients/client/clientform';
  var options = {
    method: 'get',
    'Content-Type': 'application/json',
    payload: jsonBody,
    followRedirects: false 
  };
  
  try{
    UrlFetchApp.fetch(apiUrl, options);
  } catch (error){
    console.error(error);
    const email = response_list[8];
    const data = JSON.stringify(e.namedValues, null, 2);
    MailApp.sendEmail({
      to: email,
      subject: "Error al Enviar Formulario de Registro",
      body: "Ocurrió un error al enviar la solicitud de registro al Patrocinio Jurídico de la UBA.\n\n Datos de la solicitud:" + data,
    });
  }
}
