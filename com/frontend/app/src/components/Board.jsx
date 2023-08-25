/*****************************************************************************************
*  In this component, we are using the DragDropContext component from react-beautiful-dnd *
*  to handle drag and drop across the board.                                              *
*  We are also using the Droppable component to make the dashboard a drop zone for        *
*  dragging and dropping panels.                                                          *
*  In the onDragEnd method, we can implement the logic to reorder the cards.              *
******************************************************************************************/

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Panel from './Panel';
import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import moveCard from './utils/card';
const BoardContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 20px;
  flex-grow: 1;
`;


const Board = ({id}) => {
  const [board, setBoard] = useState(null);


  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const url = process.env.REACT_APP_URL_BASE_API_REST_PATROCINIO
                  + process.env.REACT_APP_PATH_BOARD
                  + id;
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setBoard(data);
        } else {
          console.error('Failed to fetch board:', response.status);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchBoard();
  }, [id]);

  if (!board) {
    return <div>No board.</div>;
  }







  /************************************************************ */

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // If the user drops the card outside of a droppable area,
    // destination will be null, so we should return early.
    if (!destination) {
      return;
    }

    // If the user drops the card back in its original location,
    // source.index and destination.index will be the same, so we should.
    // return early
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // If destination.droppableId == source.droppableId, the panel is 
    // updated with the destination panel.
    if (destination.droppableId === source.droppableId) {
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
      //move card in backend.
      const card_to_move = board.panels[source.index];
      const id_card_to_move = String(card_to_move.id);
      const id_new_panel = String(destination.droppableId);
      moveCard(id_card_to_move, id_new_panel);

      // Find the panel that corresponds to the source droppableId.
      const sourcePanel = board.panels.find(
        (panel) => panel.id === Number(source.droppableId)
      );

      // Remove the card from the source panel.
      const sourceCards = [...sourcePanel.cards];
      const [removedCard] = sourceCards.splice(source.index, 1);
      const updatedSourcePanel = {
        ...sourcePanel,
        cards: sourceCards,
      };

      // Find the panel that corresponds to the destination droppableId.
      const destinationPanel = board.panels.find(
        (panel) => panel.id === Number(destination.droppableId)
      );

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

      setBoard({
        ...board,
        panels: updatedPanels,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
          spacing={2}>
          {/*panel-0: cards without assigned chair  */}
            <div style={{ position: "sticky", left: 0, zIndex: 1}}>
                <Panel
                key={'0'}
                index={'0'}
                panel={board.panels[0]}
                />
            </div>
            {/*rest of panels: cards with chair request  */}
            {board.panels.map((panel, index) => (
                index === 0 ? null: (
                    <Panel
                    key={panel.id}
                    index={index}
                    panel={panel}
                    />
                )
            ))}
          {provided.placeholder}
          </Stack>
          </BoardContainer>
        )}
    </Droppable>
</DragDropContext>
);
};

export default Board;


