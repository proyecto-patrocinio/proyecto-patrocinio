const ID_EXCEL = '1f2F2CUQNtdbj_xzIPiaxbFYlDysxdiwtYlBh68AO3bc';
//Indices de respuesta del formulario
const INDEX_NATIONALITY_RESPONSE = 10;
const INDEX_PROVINCE_RESPONSE = INDEX_NATIONALITY_RESPONSE +1;
const INDEX_LOCALITY_RESPONSE = INDEX_PROVINCE_RESPONSE +1;

function onFormOpen(e){
  FormApp.openById("13__bFD1qzdB0EiQ_GkkhuKFaS0RsF87TWNElnwESqIA").setConfirmationMessage(`IMPORTANTE: Por favor, aguarde a recibir un correo electrónico en las próximas horas para poder avanzar en el proceso. En caso de no recibirlo, le solicitamos que se comunique nuevamente con el departamento de patrocinio y vuelva a enviar su consulta.`);

}


function onFormSubmit(e) {
  try{
    const scriptProperties = PropertiesService.getScriptProperties();
    const apiUrl = scriptProperties.getProperty('FORM_API_URL');
    const apiToken = scriptProperties.getProperty('TOKEN');

    /* Test
    let response = FormApp.getActiveForm().getResponses()[39].getItemResponses();
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

    token = "Token " + apiToken
    
    const options =  {
      "method": 'post',
      "headers" : {
        "Authorization" : token,
        'Content-Type': 'application/json',
      },
      "payload": jsonBody,
      "followRedirects": false 
    }
    const maxRetries = 2;
    let retryCount = 0;

    function sendRequest() {
      try {
        UrlFetchApp.fetch(apiUrl, options);
        // Envío exitoso, enviar correo de éxito
        const successEmail = response_list[8];
        const successBody = HtmlService.createHtmlOutputFromFile('success').getContent();
        MailApp.sendEmail({
          to: successEmail,
          subject: "Formulario de Registro Enviado con Éxito",
          htmlBody: successBody,
        });
      } catch (error) {
        console.error(error);
        retryCount++;
        if (retryCount <= maxRetries) {
          Utilities.sleep(5000); // Esperar 5 segundos antes de volver a intentar (ajusta según sea necesario)
          sendRequest(); // Intentar el envío nuevamente
        } else {
          // Si se alcanza el máximo de reintentos, enviar correo de error
          const errorEmail = response_list[8];
          let errorTemplateBody = HtmlService.createTemplateFromFile('error');
          errorTemplateBody.nombre = response_list[0] + ' ' + response_list[1];
          const errorMsg = String(error).match(/string='(.*?)'/)
          errorTemplateBody.error = errorMsg ? errorMsg[1] : 'Error inesperado';
          let errorBody = errorTemplateBody.evaluate().setTitle("Error al enviar Formulario de Registro.").getContent()
          MailApp.sendEmail({
            to: errorEmail,
            subject: "Error al Enviar Formulario de Registro",
            htmlBody: errorBody,
          });
        }
      }
    }

    sendRequest(); // Iniciar el primer intento

  }catch (error) {
    console.error(error);
    const errorEmail = response_list[8];
    let errorTemplateBody = HtmlService.createTemplateFromFile('error');
    errorTemplateBody.nombre = response_list[0] + ' ' + response_list[1];
    errorTemplateBody.error = "Se produjo un error al intentar obtener los datos de la respuesta. Esto puede deberse a un problema en el formulario o en nuestro sistema. Le recomendamos que vuelva a intentarlo más tarde. Si el error persiste, por favor, póngase en contacto con nuestro servicio de atención al cliente. Disculpe las molestias.";
    let errorBody = errorTemplateBody.evaluate().setTitle("Error al enviar Formulario de Registro.").getContent()
          
    MailApp.sendEmail({
            to: errorEmail,
            subject: "Error al Enviar Formulario de Registro",
            htmlBody: errorBody,
          });
    throw error;
  }
}
