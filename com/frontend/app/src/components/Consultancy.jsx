/**
  In this component, we are using the DragDropContext component from react-beautiful-dnd to handle drag and drop across the board.
  We are also using the Droppable component to make the dashboard a drop zone for dragging and dropping panels.
  In the onDragEnd method, we can implement the logic to reorder the cards.
*/
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Panel from './Panel';
import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import moveCard from './utils/card';
import { getConsultationsToAssign, getListBoard, getRequestConsultations} from './utils/caseTaker'

const ConsultancyContainer = styled.div`
  display: flex;
  overflow-x: auto;
  padding: 20px;
  flex-grow: 1;
`;


const Consultancy = () => {
  const [consultancy, setConsultancy] = useState( { 'title': 'Consultoria', 'panels': []})

  useEffect(() => {
    const fetchConsultancy = async () => {
		try {
			// Get the required information
			const boards = await getListBoard()
			const inputConsultations = await getConsultationsToAssign()
			const allConsultationRequests = await getRequestConsultations()

			// Create Consultancy
			const consultancyDict = { 'title': 'Consultoria', 'panels': []}

			const inputPanel = { 
				'id': 0,
				'title': 'Nuevas Consultas',
				'number_cards': inputConsultations.length,
				'cards': inputConsultations}
			consultancyDict.panels.push(inputPanel)

			for (const board of boards) {
				const requestListForBoard = allConsultationRequests.filter(
          request => request.destiny_board === board.id
        );
				const requestPanel = {
					'id': board.id,
					'title': board.title,
					'number_cards': board.number_cards,
					'cards': requestListForBoard 
				}
				consultancyDict.panels.push(requestPanel)
			}

      setConsultancy(consultancyDict)

		} catch (error) {
			console.error("Failed to fetch cards in Consultancy.");
			console.debug(error);
		}
		};

	fetchConsultancy();
  }, []);


  /************************************************************ */
  /** 
   * TODO: Cambar los estados de las Consultas cundo se mueve a 
   *   un  panel distinto al de inputConsultations. Y generar una Request.
   *   Por otro lado, se debe eliminar la request y devolver
   *   el estado a CREATED si se vuelve al panel inputConsultations.
   * */

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
      const panel = consultancy.panels.find(
        (panel) => panel.id === destination.droppableId
      );
      // Remove the card from the source index. And add it to the destination index.
      const cards = [...panel.cards];
      const [removedCard] = cards.splice(source.index, 1);
      cards.splice(destination.index, 0, removedCard);
      const updatedPanel = {
        ...panel,
        cards,
      };
      // Update the consultancy state with the updated panel.
      const updatedPanels = consultancy.panels.map((panel) => {
        if (panel.id === destination.droppableId) {
          return updatedPanel;
        }
        return panel;
      });
      setConsultancy({
        ...consultancy,
        panels: updatedPanels,
      });

    // If destination.droppableId != source.droppableId
    } else {
      //move card in backend.
      const card_to_move = consultancy.panels[source.index];
      const id_card_to_move = String(card_to_move.id);
      const id_new_panel =String(destination.droppableId);
      moveCard(id_card_to_move, id_new_panel);

      // Find the panel that corresponds to the source droppableId.
      const sourcePanel = consultancy.panels.find(
        (panel) => panel.id === source.droppableId
      );

      // Remove the card from the source panel.
      const sourceCards = [...sourcePanel.cards];
      const [removedCard] = sourceCards.splice(source.index, 1);
      const updatedSourcePanel = {
        ...sourcePanel,
        cards: sourceCards,
      };

      // Find the panel that corresponds to the destination droppableId.
      const destinationPanel = consultancy.panels.find(
        (panel) => panel.id === destination.droppableId
      );

      // Add the card to the destination panel.
      const destinationCards = [...destinationPanel.cards];
      destinationCards.splice(destination.index, 0, removedCard);
      const updatedDestinationPanel = {
        ...destinationPanel,
        cards: destinationCards,
      };

      // Update the consultancy state with the updated source and destination panels.
      const updatedPanels = consultancy.panels.map((panel) => {
        if (panel.id === destination.droppableId) {
          return updatedDestinationPanel;
        }
        if (panel.id === source.droppableId) {
          return updatedSourcePanel;
        }
        return panel;
      });

      setConsultancy({
        ...consultancy,
        panels: updatedPanels,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={"consultancy-1"} direction="horizontal">
        {(provided) => (
          <ConsultancyContainer
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
                panel={consultancy.panels[0]}
                />
            </div>
            {/*rest of panels: cards with chair request  */}
            {consultancy.panels.map((panel, index) => (
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
          </ConsultancyContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Consultancy;

