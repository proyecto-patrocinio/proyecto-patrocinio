async function getDataBoard(id_board) {
  try {
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
      + process.env.REACT_APP_PATH_BOARD
      + id_board;
    const response = await fetch(url);
    if (response.ok) {
      const board = await response.json();
      return board;
    } else {
      console.error('Failed to fetch board:', response.status);
      throw new Error('Failed to fetch board');
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
export default getDataBoard;

export const acceptRequestCard = async(id_request_consultation, id_panel) => {
  try{
    const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
    + process.env.REACT_APP_PATH_REQUEST_CARDS
    + String(id_request_consultation)
    + process.env.REACT_APP_EXTRA_PATH_ACCEPT_REQUEST_CARDS;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "destiny_panel": id_panel
      })
    });

    if (response.ok) {
      const successMessage = `Request Consultation ${id_request_consultation} accepted successfully`;
      console.log(successMessage);
    } else {
      console.error("Failed to accept the consultation request: ", response.status);
      throw new Error("Failed to accept the consultation request");
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
