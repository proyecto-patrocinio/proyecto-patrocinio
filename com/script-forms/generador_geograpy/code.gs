const ID_FORM = '13__bFD1qzdB0EiQ_GkkhuKFaS0RsF87TWNElnwESqIA'; // ID del formulario
const BASE_LOCALITY_SECTIONS_NUM_ITEM = 16 // Indice del elemento donde empiezan las secciones de localidad

function clear_form() {
  let form = FormApp.openById(ID_FORM);
  let elements = form.getItems();
  elements.forEach(element => form.deleteItem(element))
}

function create_questions() {

//  clear_form();
  let form = FormApp.openById(ID_FORM);
//  form.setTitle("Información del Consultante");

  // Get Table Data
  let sheet_geography = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("geography");
  let table_geography = sheet_geography.getRange(2, 1, sheet_geography.getLastRow() - 1, sheet_geography.getLastColumn()).getValues();

  // Create Nacionality Question
  let nacionality_question = form.addListItem();
  nacionality_question.setTitle("Nacionalidades");
  let nationality_list = [...new Set(table_geography.map(row => row[0]))];
  console.log(table_geography)
  nacionality_question.setChoiceValues(nationality_list);

  // Create Province from Argentina Question
  let province_section = form.addPageBreakItem();
  province_section.setTitle("Provincias de Agentina")
  let question_province = form.addListItem();
  question_province.setTitle("Provincia");

  let provinces_list = [...new Set(table_geography.map(row => row[1]))];
  //question_province.setChoiceValues(provinces_list);
  const address_section = form.getItems()[BASE_LOCALITY_SECTIONS_NUM_ITEM+46].asPageBreakItem();
 
  provinces_list.forEach( (province,index) => {

    let province_section = form.addPageBreakItem();
    province_section.setTitle("Localidades de "+ province)
    let question_province_i = form.addListItem();
    question_province_i.setTitle("Localidades");

    //console.log(form.getItems()[BASE_LOCALITY_SECTIONS_NUM_ITEM+(index*2)+1].getTitle())
    //*** IMPORTANTE: Chequear que el excel este acrivo el filtro de argentina.!***
    let localities_list = table_geography.filter( row => row[1]==province);
    localities_list = [...new Set(localities_list.map(row => row[2]))];
    if (index < 23){
      form.getItems()[BASE_LOCALITY_SECTIONS_NUM_ITEM+(index*2)+1].asListItem().setChoiceValues(localities_list);
      form.getItems()[BASE_LOCALITY_SECTIONS_NUM_ITEM+(index*2)+1].asListItem().setRequired(true);
      form.getItems()[BASE_LOCALITY_SECTIONS_NUM_ITEM+(index*2)].asPageBreakItem().setGoToPage(address_section);
    }

  }) 
}
