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
