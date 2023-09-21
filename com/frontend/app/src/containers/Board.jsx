/*****************************************************************************************
*  In this component, we are using the DragDropContext component from react-beautiful-dnd *
*  to handle drag and drop across the board.                                              *
*  We are also using the Droppable component to make the dashboard a drop zone for        *
*  dragging and dropping panels.                                                          *
*  In the onDragEnd method, we can implement the logic to reorder the cards.              *
******************************************************************************************/

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Panel from './BoardPanel';
import styled from '@emotion/styled';
import { Stack, Alert } from '@mui/material';
import moveCard from '../utils/card';
import getDataBoard from '../utils/board';
import {acceptRequestCard} from '../utils/board'
import CreatePanelButton from '../components/CreatePanelButton';
import onDragEnd from '../utils/dragAndDrop';


const BoardContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 20px;
  flex-grow: 1;
`;


const PANEL_INPUT_REQUEST_CARDS_ID = 0


const Board = ({id}) => {
  const [board, setBoard] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [updateCounter, setUpdateCounter] = useState(0);  // force view refresh


/**
 * Fetch board data from the backend and initialize the board state.
 * This useEffect hook is triggered when the 'id' dependency changes.
 */
  useEffect(() => {
    const fetchBoard = async () => {
      const board_data = await getDataBoard(id);
      const inputPanel = { 
        'id': PANEL_INPUT_REQUEST_CARDS_ID,
        'title': 'New Requests',
        'cards': board_data.request_consultations
      }
      board_data.panels.unshift(inputPanel)
      setBoard(board_data);
    };
    fetchBoard();
  }, [id]);


  /**
  * Add a new panel with the specified ID and title to the board.
  *
  * @param {number} id - The ID of the new panel.
  * @param {string} title - The title of the new panel.
  */
  const addNewPanel = (id, title) => {
    const newPanel = { 
      'id': id,
      'title': title,
      'cards': []
    }
    board.panels.push(newPanel)
    setBoard(board);
    setUpdateCounter(updateCounter + 1);  // force view refresh
  };


  /**
   * Update the backend when moving a card from one panel to another.
  *
  * @param {Object} sourcePanel - The source panel from which the card is being moved.
  * @param {Object} destinationPanel - The destination panel to which the card will be moved.
  * @param {number} sourceCardIndex - The index of the card in the source panel.
  * @returns {Promise<boolean>} - A Promise that resolves to `true` if the card was moved successfully, or `false` if there was an error.
  */
  const updateBackend = async (sourcePanel, destinationPanel, sourceCardIndex ) => {
    const cardToMove = sourcePanel.cards[sourceCardIndex];
    const idCardToMove = cardToMove.consultation;
    const idDestinyPanel = destinationPanel.id;
    const idOriginPanel = sourcePanel.id;
    
    if(idDestinyPanel === PANEL_INPUT_REQUEST_CARDS_ID){
      // It's not possible to move a card to the input panel.
      console.error("Unable to send a card to input request.")
      setShowAlert(true)
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
      return false;
    }
    if(idOriginPanel === PANEL_INPUT_REQUEST_CARDS_ID){
      const isAccept = await acceptRequestCard(idCardToMove, idDestinyPanel);
      return isAccept;
    } else { // Move Card from Panel to other normal panel.
      const isMoved = await moveCard(idCardToMove, idDestinyPanel);
      return isMoved;
    }
  };


  /**
   * Handle the drag-and-drop event of a card.
   *
   * @param {Object} result - The result of the card's drag-and-drop event.
   */
  const handleOnDragEnd = (result) => {
    onDragEnd(result, board, setBoard, updateBackend);
  }


  if (!board) {
    return <div>No board.</div>;
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        {showAlert && (
          <Alert severity="error">It is not possible to move a card to the input panel.</Alert>
        )}
        <Droppable droppableId={"board"+String(id)} direction="horizontal">
          {(provided) => (
            <BoardContainer
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={2}
            >
              {/*panel-0: Input Request Cards.*/}
              <div style={{ position: "sticky", left: 0, zIndex: 1}}>
                <Panel
                  key={"0"}
                  index={0}
                  panel={board.panels[0]}
                />
              </div>
              <CreatePanelButton key={"panel-template"} boardID={id} addPanel={addNewPanel}/>
                {/*rest of panels: Panels with cards. */}
                {board.panels.map((panel, index) => (
                  index === 0 ? null: (
                    <Panel
                      key={String(panel.id)}
                      panel={panel}
                      index={index}
                    />
                  )
                ))}
                {provided.placeholder}
            </Stack>
          </BoardContainer>
        )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Board;
