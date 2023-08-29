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
import getDataBoard from './utils/board';


const BoardContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 20px;
  flex-grow: 1;
`;


const PANEL_INPUT_REQUEST_CARDS_ID = 0


const Board = ({id}) => {
  const [board, setBoard] = useState(null);


  useEffect(() => {

    const fetchBoard = async () => {
      const board_data = await getDataBoard(id);
      const inputPanel = { 
        'id': PANEL_INPUT_REQUEST_CARDS_ID,
        'title': 'Nuevas Solicitudes',
        'cards': board_data.request_consultations
      }
      board_data.panels.unshift(inputPanel)
      setBoard(board_data);
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
    if (destination == null) {
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
      //move card in backend.
      const panel_source = board.panels[Number(source.droppableId)]
      const card_to_move = panel_source.cards[source.index];
      const id_card_to_move = String(card_to_move.consultation);
      const id_new_panel = String(Number(destination.droppableId));
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
          {/*panel-0: Input Request Cards.*/}
            <div style={{ position: "sticky", left: 0, zIndex: 1}}>
                <Panel
                key={"0"}
                index={0}
                panel={board.panels[0]}
                />
            </div>
            {/*rest of panels: Panels with cards. */}
            {board.panels.map((panel, index) => (
                index === 0 ? null: (
                    <Panel
                    key={String(panel.id)}
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


