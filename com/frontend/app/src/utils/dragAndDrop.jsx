/**
 * Handle the drag-and-drop operation when a card is moved within or between panels.
 *
 * @param {Object} result - The drag-and-drop result object containing source and destination information.
 * @param {Object} board - The current board state.
 * @param {Function} setBoard - A function to update the board state.
 * @param {Function} updateBackend - A function to update the backend based on the drag-and-drop operation.
 *                                  This function should receive the following parameters:
 *                                  sourcePanel, destinationPanel, indexTicket (source.index is the index of the tiket in source panel)
 */
const onDragEnd = async(result, board, setBoard, updateBackend) => {
  const { source, destination } = result;

  // If the user drops the card outside of a droppable area,
  // destination will be null, so we should return early.
  if (destination == null) {
    console.debug('Droppable area outside of droppable area.');
    return;
  }

  // If the user drops the card back in its original location,
  // source.index and destination.index will be the same, so we should.
  // return early
  if (
    source.droppableId === destination.droppableId &&
    source.index === destination.index
  ) {
    console.debug('Destiny area is the same.')
    return;
  }

  // If destination.droppableId == source.droppableId, the panel is 
  // updated with the destination panel.
  if (Number(destination.droppableId) === Number(source.droppableId)) {
    const panel = board.panels.find(
      (panel) => panel.id === Number(destination.droppableId)
    );
    // Remove the card from the source index. And add it to the destination index.
    const cards = [...panel.cards];
    const [removedCard] = cards.splice(source.index, 1);
    cards.splice(destination.index, 0, removedCard);
    const updatedPanel = {
      ...panel,
      cards,
    };
    // Update the board state with the updated panel.
    const updatedPanels = board.panels.map((panel) => {
      if (panel.id === Number(destination.droppableId)) {
        return updatedPanel;
      }
      return panel;
    });
    setBoard({
      ...board,
      panels: updatedPanels,
    });

  // If destination.droppableId != source.droppableId
  } else {

    // Find the panel that corresponds to the source droppableId.
    const sourcePanel = board.panels.find(
      (panel) => panel.id === Number(source.droppableId)
    );

    // Find the panel that corresponds to the destination droppableId.
    const destinationPanel = board.panels.find(
      (panel) => panel.id === Number(destination.droppableId)
    );


    /*** Update Frontend ***/
    // Remove the card from the source panel.
    const sourceCards = [...sourcePanel.cards];
    const [removedCard] = sourceCards.splice(source.index, 1);
    const updatedSourcePanel = {
      ...sourcePanel,
      cards: sourceCards,
    };

    // Add the card to the destination panel.
    const destinationCards = [...destinationPanel.cards];
    destinationCards.splice(destination.index, 0, removedCard);
    const updatedDestinationPanel = {
      ...destinationPanel,
      cards: destinationCards,
    };
    
    // Update the board state with the updated source and destination panels.
    const updatedPanels = board.panels.map((panel) => {
      if (panel.id === Number(destination.droppableId)) {
        return updatedDestinationPanel;
      }
      if (panel.id === Number(source.droppableId)) {
        return updatedSourcePanel;
      }
      return panel;
    });

    const newBoard = {
      ...board,
      panels: updatedPanels,
    }
    setBoard(newBoard);

    /*** Update Backend ***/
    try {
      await updateBackend(sourcePanel, destinationPanel, source.index, newBoard)
    } catch (error) {
      console.error("Error wihle tring to move cards:", error);
      setBoard(board); //backup
    };
  }
};

export default onDragEnd;
