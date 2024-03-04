const ID_EXCEL = '1f2F2CUQNtdbj_xzIPiaxbFYlDysxdiwtYlBh68AO3bc';
const FORM_ID = "14tjyqssjA5XzfNmi87oBuOO7dGRPcIN8luOS6ggeDQU"

//Indices de respuesta del formulario
const INDEX_NATIONALITY_RESPONSE = 7;
const INDEX_PROVINCE_RESPONSE = INDEX_NATIONALITY_RESPONSE +1;
const INDEX_LOCALITY_RESPONSE = INDEX_PROVINCE_RESPONSE +1;

function onFormOpen(e){
  FormApp.openById(FORM_ID).setConfirmationMessage("Se ha registrado su respuesta. Para registrar otro hijo/a, seleccione 'Enviar otra respuesta'.\n\n \
  Si ya ha terminado de registrar a todos sus hijos, el formulario ha sido completado. \n\n \
  IMPORTANTE: Por favor, aguarde a recibir un correo electrónico en las próximas horas para poder avanzar en el proceso. En caso de no recibirlo, le solicitamos que se comunique nuevamente con el departamento de patrocinio y vuelva a enviar su consulta.");
}

function onFormSubmit(e) {
  let retryCount = 0
  const maxRetries = 3
  try{
      const scriptProperties = PropertiesService.getScriptProperties();
      const apiUrl = scriptProperties.getProperty('FORM_API_URL');
      const apiToken = scriptProperties.getProperty('TOKEN');
      
      /* TEST
      let response = FormApp.getActiveForm().getResponses()[16].getItemResponses();
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

      token = "Token " + apiToken
      const options = {
        "method": 'post',
        "headers" : {
          "Authorization" : token,
          'Content-Type': 'application/json',
        },
        "payload": jsonBody
      };

      function sendRequest() {
        try {
          UrlFetchApp.fetch(apiUrl, options);
          // Envío exitoso, enviar correo de éxito
          const successEmail = response_list[11];
          let successTemplateBody = HtmlService.createTemplateFromFile('success');
          successTemplateBody.firstname = response_list[1];
          successTemplateBody.lastname = response_list[2];
          const successBody = successTemplateBody.evaluate().setTitle("Formulario de Información Familiar Enviado con Éxito.").getContent()
          MailApp.sendEmail({
            to: successEmail,
            subject: "Formulario de Información Familiar Enviado con Éxito",
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
            const errorEmail = response_list[11];
            let errorTemplateBody = HtmlService.createTemplateFromFile('error');
            errorTemplateBody.firstname = response_list[1];
            errorTemplateBody.lastname = response_list[2];
            const errorMsg = String(error).match(/string='(.*?)'/)
            errorTemplateBody.error = errorMsg ? errorMsg[1] : 'Error inesperado';
            let errorBody = errorTemplateBody.evaluate().setTitle("Error al enviar Formulario de Información Familiar.").getContent()
            MailApp.sendEmail({
              to: errorEmail,
              subject: "Error al Enviar Formulario de Información Familiar",
              htmlBody: errorBody,
            });
          }
        }
      }

      sendRequest(); // Iniciar el primer intento
      
  }catch (error) {
    console.error(error);
    retryCount++;
    if (retryCount <= maxRetries) {
      Utilities.sleep(5000); // Esperar 5 segundos antes de volver a intentar (ajusta según sea necesario)
      sendRequest(); // Intentar el envío nuevamente
    } else {
      // Si se alcanza el máximo de reintentos, enviar correo de error
      const errorEmail = response_list[11];
      let errorTemplateBody = HtmlService.createTemplateFromFile('error');
      errorTemplateBody.firstname = response_list[1];
      errorTemplateBody.lastname = response_list[2];
      const errorMsg = String(error).match(/string='(.*?)'/)
      errorTemplateBody.error = errorMsg ? errorMsg[1] : 'Error inesperado';
      let errorBody = errorTemplateBody.evaluate().setTitle("Error al enviar Formulario de Información Familiar.").getContent()
      MailApp.sendEmail({
        to: errorEmail,
        subject: "Error al Enviar Formulario de Información Familiar",
        htmlBody: errorBody,
      });
    }
  }
}
