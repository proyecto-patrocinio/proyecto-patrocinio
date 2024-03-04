/**
 * Triggered when a Google Form is submitted. 
 * Retrieves the authentication token from script properties and sends a POST request
 * to the specified server API URL with form response data.
 *
 * @param {Object} e - The form submit event object.
 */

function onFormSubmit(e) {
  let retryCount = 0
  const maxRetries = 3
  try{
      const scriptProperties = PropertiesService.getScriptProperties();
      const apiToken = scriptProperties.getProperty('TOKEN');
      const apiURL = scriptProperties.getProperty('FORM_API_URL');


      /* TEST
      let response = FormApp.getActiveForm().getResponses()[41].getItemResponses();
      responseList = response.map((preg) => preg.getResponse());
      */
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
      

    function sendRequest() {
      try {
        UrlFetchApp.fetch(apiURL, options);
        // Envío exitoso, enviar correo de éxito
        const successEmail = responseList[4];
        const successBody = HtmlService.createHtmlOutputFromFile('success').getContent();
        MailApp.sendEmail({
          to: successEmail,
          subject: "Formulario de Consulta Enviado con Éxito",
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
          const errorEmail = responseList[4];
          let errorTemplateBody = HtmlService.createTemplateFromFile('error');
          errorTemplateBody.title = responseList[1];
          const errorMsg = String(error).match(/string='(.*?)'/)
          errorTemplateBody.error = errorMsg ? errorMsg[1] : 'Error inesperado';
          let errorBody = errorTemplateBody.evaluate().setTitle("Error al enviar Formulario de Consulta.").getContent()
          MailApp.sendEmail({
            to: errorEmail,
            subject: "Error al Enviar Formulario de Consulta",
            htmlBody: errorBody,
          });
        }
      }
    }

    sendRequest(); // Iniciar el primer intento

  }catch (error) {
    console.error(error);
    const errorEmail = responseList[4];
    let errorTemplateBody = HtmlService.createTemplateFromFile('error');
    errorTemplateBody.title = responseList[1];
    errorTemplateBody.error = "Se produjo un error al intentar obtener los datos de la respuesta. Esto puede deberse a un problema en el formulario o en nuestro sistema. Le recomendamos que vuelva a intentarlo más tarde. Si el error persiste, por favor, póngase en contacto con nuestro servicio de atención al cliente. Disculpe las molestias.";
    let errorBody = errorTemplateBody.evaluate().setTitle("Error al enviar Formulario de Consulta.").getContent()
          
    MailApp.sendEmail({
            to: errorEmail,
            subject: "Error al Enviar Formulario de Consulta",
            htmlBody: errorBody,
          });
    throw error;
  }

}
