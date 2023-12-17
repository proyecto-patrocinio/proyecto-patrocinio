//Documentacion:  https://developers.google.com/apps-script/guides/properties?hl=es-419

function updateProperties() {
  try {
   const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperties({
    'SERVER_URL': 'mi-url',
    'TOKEN': 'mi-token',
  });
  } catch (err) {
    console.log('Update Properties Failed With Error: %s', err.message);
  }
}
