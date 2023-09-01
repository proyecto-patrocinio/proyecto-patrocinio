async function moveCard(cardID, destinyPanelID) {
    try {
      const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
        + process.env.REACT_APP_PATH_CARDS
        + String(cardID)
        + "/";

      const request = new XMLHttpRequest();
      request.open('PATCH', url);
      request.setRequestHeader( 'Content-Type', 'application/json');
      request.onreadystatechange = () => { // Call a function when the state changes.
        if (request.readyState === XMLHttpRequest.DONE ) {
          if( request.status !== 200){
            console.error('Failed to PATCH card, with ID',cardID, ". Status: ", request.status);
            throw new Error('Failed to PATCH card');
          }
        }
      }
      request.send(
        JSON.stringify({
            "panel": destinyPanelID,
        })
      );

    } catch (error) {
      console.error('Error in moveCard: ', error);
      throw error;
    }
  }

export default moveCard;
