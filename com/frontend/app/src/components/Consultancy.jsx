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
import {
  createRequest,
  deleteRequest,
  getConsultationsToAssign,
  getConsultancyBoard
} from './utils/caseTaker'


const ConsultancyContainer = styled.div`
	display: flex;
	overflow-x: auto;
	padding: 20px;
	flex-grow: 1;
`;


const PANEL_INPUT_CONSULTATION_ID = 0


const Consultancy = () => {
	const [consultancy, setConsultancy] = useState( { 'title': 'Consultoria', 'panels': [{'id':0, 'title': 'Nuevas Consultas', 'number_cards':0 , 'cards': [] }]})

	useEffect(() => {
		const fetchConsultancy = async () => {
		try {
			// Get the required information
			const inputConsultations = await getConsultationsToAssign()
			const allConsultancyData = await getConsultancyBoard()
			// Create Consultancy
			const inputPanel = { 
        'id': PANEL_INPUT_CONSULTATION_ID,
				'title': 'Nuevas Consultas',
				'number_cards': inputConsultations.length,
				'cards': inputConsultations
      }
      allConsultancyData.panels.unshift(inputPanel);
      setConsultancy(allConsultancyData)
      console.log(allConsultancyData)
      
		} catch (error) {
      console.error("Failed to fetch cards in Consultancy.");
			console.debug(error);
		}
  };
  
  fetchConsultancy();
  }, []);

  if(!consultancy){
    return <div>No data.</div>
  }


  /************************************************************ */

  const onDragEnd = async (result) => {
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
    if (destination.droppableId === source.droppableId) {
      const panel = consultancy.panels.find(
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
      // Update the consultancy state with the updated panel.
      const updatedPanels = consultancy.panels.map((panel) => {
        if (panel.id === Number(destination.droppableId)) {
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

      // Find the panel that corresponds to the destination droppableId.
      const destinationPanel = consultancy.panels.find(
        (panel) => panel.id === Number(destination.droppableId)
      );

      // Find the panel that corresponds to the source droppableId.
      const sourcePanel = consultancy.panels.find(
        (panel) => panel.id === Number(source.droppableId)
      );

      /*** Update Backend ***/
      const cardToMove = sourcePanel.cards[source.index];
      const requestAndConsultationID = cardToMove.consultation;
      const destinyPanelID = destinationPanel.id; // Destination boards || input panel with the consultations.
      const originPanelID = sourcePanel.id;

      if(originPanelID !== PANEL_INPUT_CONSULTATION_ID){
        // Canceler current Request Consultation.
        await deleteRequest(requestAndConsultationID);
      } // ELSE No have a current request consultation.

      if( destinyPanelID !== PANEL_INPUT_CONSULTATION_ID){
        // Generate new Request Consultation
        await createRequest(requestAndConsultationID, destinyPanelID);
      } // ELSE No generate a new request consultation.

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

      // Update the consultancy state with the updated source and destination panels.
      const updatedPanels = consultancy.panels.map((panel) => {
        if (panel.id === Number(destination.droppableId)) {
          return updatedDestinationPanel;
        }
        if (panel.id === Number(source.droppableId)) {
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
      <Droppable droppableId={"consultancy"} direction="horizontal">
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
          {/*panel-0: Input Coonsultations.*/}
            <div style={{ position: "sticky", left: 0, zIndex: 1}}>
                <Panel
                key={"0"}
                index={0}
                panel={consultancy.panels[0]}
                />
            </div>
            {/*rest of panels: One panel for each BOARD containing its request cards.*/}
            {consultancy.panels.map((panel, index) => (
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
          </ConsultancyContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Consultancy;
