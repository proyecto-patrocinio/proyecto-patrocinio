/*************************************************************************************
 * Funciones para parcear los valores del formulario al formato esperado por la API. *
 *************************************************************************************/

//-------------------------------------------------------------------------------------
//                            DEFINICIONES
//-------------------------------------------------------------------------------------

const SEX = {
    MASCULINO:'MALE',
    FEMENINO:'FEMALE'
}

const MARITAL_STATUS = {
    "SOLTERO/A":'SINGLE',
    "CASADO/A":'MARRIED',
    "DIVORCIADO/A":'DIVORCED',
    "VIUDO/A":'WIDOWER',
}

const HOUSING_TYPE = {
    "CASA":'HOUSE',
    "DEPARTAMENTO":'DEPARTMENT',
    "REMOLQUE":'TRAILER',
    "SITUACIÓN DE CALLE":'STREET_SITUATION',
}

const STUDIES = {
    "PRIMARIO INCOMPLETO":'INCOMPLETE_PRIMARY',
    "PRIMARIO COMPLETO":'COMPLETE_PRIMARY',
    "SECUNDARIO INCOMPLETO":'INCOMPLETE_SECONDARY',
    "SECUNDARIO COMPLETO":'COMPLETE_SECONDARY',
    "TERCIARIO INCOMPLETO":'INCOMPLETE_TERTIARY',
    "TERCIARIO COMPLETO":'COMPLETE_TERTIARY',
    "UNIVERSIDAD INCOMPLETA":'INCOMPLETE_UNIVERSITY',
    "UNIVERSIDAD COMPLETA":'COMPLETE_UNIVERSITY'
}

const ID_TYPE = {
    DOCUMENTO:'DOCUMENT',
    PASAPORTE:'PASSPORT'
}


//-------------------------------------------------------------------------------------
//                            FUNCIONES
//-------------------------------------------------------------------------------------

function get_locality(nationality_name, locality_name) {
  const excel_locality = SpreadsheetApp.openById(ID_EXCEL);
  let sheet_geography = excel_locality.getSheetByName("geography");
  let table_geography = sheet_geography.getRange(2, 1, sheet_geography.getLastRow() - 1, sheet_geography.getLastColumn()).getValues();
  if (nationality_name === "Argentina"){
    let locality_code = table_geography.filter(row => row[2] === locality_name)[0][3];
    return locality_code;
  } else {
    let locality_code = table_geography.filter(row => row[0] === nationality_name)[0][3];
    return locality_code;
  }
}
