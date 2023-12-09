/*****************************************************************************************
*  In this component, we are using the DragDropContext component from react-beautiful-dnd *
*  to handle drag and drop across the board.                                              *
*  We are also using the Droppable component to make the dashboard a drop zone for        *
*  dragging and dropping panels.                                                          *
*  In the onDragEnd method, we can implement the logic to reorder the cards.              *
******************************************************************************************/

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from '@emotion/styled';
import { Stack } from '@mui/material';
import {
  createRequest,
  deleteRequest,
  getConsultationsToAssign,
  getConsultancyBoard
} from '../utils/caseTaker'
import ConsultationFormButton from '../components/consultation/form/ConsultationFormButton'
import onDragEnd from '../utils/dragAndDrop';
import ConsultationPanel from './ConsultationPanel';
import RequestPanel from './RequestPanel';
import { CONSULTANCY_GROUP_NAME, Notification } from '../sockets/Notification';

const ConsultancyContainer = styled.div`
	display: flex;
	overflow-x: auto;
	padding: 20px;
	flex-grow: 1;
`;


const PANEL_INPUT_CONSULTATION_ID = 0


/**
 * Consultancy Component
 *
 * This component represents the Consultancy feature of the application, including the management
 * of consultations and their panels. It provides functionality for adding new consultations, handling
 * card movement with drag-and-drop, and initializing consultancy data.
 */
const Consultancy = () => {
	const [consultancy, setConsultancy] = useState({ 'title': 'Consultancy', 'panels': [{'id':0, 'title': 'Available Consultations', 'number_cards':0 , 'cards': [] }]})
  const [updateCounter, setUpdateCounter] = useState(0);  // force view refresh
  const [forceFetchConsultancy, setforceFetchConsultancy] = useState(0); // force refetch board from notification websocket.


/**Initialize Consultancy Data **/
	useEffect(() => {
		const fetchConsultancy = async () => {
		try {
			// Get the required information
			const inputConsultations = await getConsultationsToAssign()
			const allConsultancyData = await getConsultancyBoard()
			// Create Consultancy
			const inputPanel = { 
        'id': PANEL_INPUT_CONSULTATION_ID,
				'title': 'Available Consultations',
				'number_cards': inputConsultations.length,
				'cards': inputConsultations
      }
      allConsultancyData.panels.unshift(inputPanel);
      setConsultancy(allConsultancyData)

		} catch (error) {
      console.error("Failed to fetch cards in Consultancy.");
			console.debug(error);
		}
  };
  
  fetchConsultancy();
  }, [forceFetchConsultancy]);


  /**
   * Update Backend for Card Movement
   *
   * This function handles the backend update when a card is moved from one panel to another.
   * It cancels the current request consultation if the card is moved from a panel other than the
   * input consultation panel. If the card is moved to the input consultation panel, it generates
   * a new request consultation. It also updates the number of cards in the consultation panel accordingly.
   *
   * @param {Object} sourcePanel - The source panel from which the card is being moved.
   * @param {Object} destinationPanel - The destination panel to which the card will be moved.
   * @param {number} sourceCardIndex - The index of the card in the source panel.
   * @param {Object} newConsultancy - The new consentancy state.
   * @returns {boolean} IF the API process was successful or not.
   */
  const updateBackend = async(sourcePanel, destinationPanel, sourceCardIndex, newConsultancy) => {
    const cardToMove = sourcePanel.cards[sourceCardIndex];
    const requestAndConsultationID = cardToMove.consultation;
    const destinyPanelID = destinationPanel.id; // Destination boards OR Input panel with the consultations.
    const originPanelID = sourcePanel.id;

    try {
      if (originPanelID !== PANEL_INPUT_CONSULTATION_ID){
        // Canceler current Request Consultation.
        await deleteRequest(requestAndConsultationID);
      } else {
        // ELSE No have a current request consultation.
        newConsultancy.panels[0].number_cards --;
      }

      if( destinyPanelID !== PANEL_INPUT_CONSULTATION_ID){
        // Generate new Request Consultation
        await createRequest(requestAndConsultationID, destinyPanelID);
      } else {
        // ELSE No generate a new request consultation.
        newConsultancy.panels[0].number_cards ++;
      }
      setConsultancy(newConsultancy);
      return true;
    } catch (e) {
      console.error("Error moving request/card: " + e.message);
      setConsultancy(consultancy);//backup
      return false;
    }
  };


  /**
  * Add a new consultation to the consultancy panels.
  *
  * @param {Object} consultation - The consultation object with
  * id', 'availability_state', 'progress_state', 'time_stamp', 'description', 'opponent', 'tag', and 'client' fields.
  */
  const addNewConsultation = (consultation) => {
    const newConsultation = {
      "id": consultation.id,
      "availability_state": consultation.availability_state,
      "progress_state": consultation.progress_state,
      "time_stamp": consultation.time_stamp,
      "description": consultation.description,
      "opponent": consultation.opponent,
      "tag": consultation.tag,
      "client": consultation.client,
      "consultation": consultation.id
    }
    consultancy.panels[0].cards.push(newConsultation)
    consultancy.panels[0].number_cards ++;
    setConsultancy(consultancy);
    setUpdateCounter(updateCounter + 1);  // force view refresh
  };


  /**
   * Handle the drag-and-drop event of a card.
   *
   * @param {Object} result - The result of the card's drag-and-drop event.
   */
  const handleOnDragEnd = (result) => {
    onDragEnd(result,consultancy, setConsultancy, updateBackend);
  };


  if(!consultancy){
    return <div>No data.</div>
  };


  return (
    <>
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <ConsultancyContainer>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={2}
          key={"stack-container"}
        >
          {/*panel-0: Input Coonsultations.*/}
            <div style={{ position: "sticky", left: 0, zIndex: 1}}>
                <ConsultationPanel
                key={"0"}
                index={0}
                panel={consultancy.panels[0]}
                />
            </div>
            <ConsultationFormButton  key={"consultation-form"} addNewConsultation={addNewConsultation}/>
            {/*rest of panels: One panel for each BOARD containing its request cards.*/}
            {consultancy.panels.map((panel, index) => (
                index === 0 ? null: (
                    <RequestPanel
                    key={String(panel.id)}
                    panel={panel}
                    index={index}
                    />
                )
            ))}
          </Stack>
          </ConsultancyContainer>
    </DragDropContext>
    <Notification channelName={CONSULTANCY_GROUP_NAME} onReceiveMessage={() => setforceFetchConsultancy(forceFetchConsultancy + 1)}/>
    </>
  );
};

export default Consultancy;
