import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import SimpleDialog from '../../SimpleDialog';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IconButton, Paper, TextField, Typography } from '@mui/material';
import { createEvent, deleteEvent, getCalendarByCard } from '../../../utils/calendar';
import AlertSnackbar from '../../AlertSnackbar';
import DeleteIcon from '@mui/icons-material/Delete';

const theme = createTheme();

const localizer = momentLocalizer(moment);


/**
 * CalendarView component for displaying and managing events in a calendar.
 * @param {number} cardID - The ID of the card associated with the calendar.
 * @returns {JSX.Element} - The rendered CalendarView component.
 */
const CalendarView = ({cardID}) => {
  const [openNewDate, setOpenNewDate] = useState(false);
  const [events, setEvents] = useState([]);
  const [calendarID, setCalendarID] = useState(null);
  const [newEventData, setNewEventData] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [errorMenssage, setErrorMessage] = useState(null);


  /**
   * Fetches events for the specified card when the component mounts.
   */
  useEffect(()=>{
    const getEvents = async () => {
      try{
        const calendar_response = await getCalendarByCard(cardID);
        setEvents(calendar_response?.events || []);
        setCalendarID(calendar_response.id);
      } catch (e){
        const mns = "Failed to get events.";
        console.error(mns);
        setErrorMessage(mns);
      }
    };
    getEvents();
  }, [cardID])


  /**
   * Handles the selection of a time slot in the calendar.
   * @param {object} event - The selected time slot event.
   */
  const handleSelectSlot = (event) => {
    setNewEventData(null);
    setSelectedEvent(null);
    setSelectedDates(event);
    setOpenNewDate(true);
  };

  /**
   * Handles the addition of a new event to the calendar.
   */
  const handleAddEvent = async () => {
    if (newEventData?.title !== '') {
      const newEvent = {
        title: newEventData?.title,
        calendar: calendarID,
        description: newEventData?.description,
        start: selectedDates.start,
        end: selectedDates.end,
      };
      try {
        const response = await createEvent(newEvent);
        setEvents([...events, response]);
        setNewEventData(null);
        setOpenNewDate(false);
      } catch (e) {
        setErrorMessage(e);
      }
    } else {
      setErrorMessage("Title is required.")
    }
  };

  /**
   * Handles the deletion of the selected event from the calendar.
   */
  const handleDeletedEvent = async () => {
    try {
      const id = selectedEvent?.id
      await deleteEvent(id);
      const updatedEvents = events.filter(event => event.id !== id);

      setEvents(updatedEvents);
      setNewEventData(null);
      setSelectedEvent(null);
      setOpenNewDate(false);
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: '500px', position: 'relative', padding: '20px', background: '#e0f7fa' }}>
        <Calendar
          color="primary"
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={['month', 'week', 'day']}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={setSelectedEvent}
          messages={{
            today: 'Today',
            next: 'Next',
            previous: 'Previous',
            month: 'Month',
            week: 'Week',
            day: 'Day',
          }}
        />

        {selectedEvent && (
          <Paper style={{ marginTop: '30px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', background: '#bbdefb', padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h5" style={{ marginBottom: '10px', color: '#2196f3' }}>{selectedEvent.title}</Typography>
            <Typography style={{ fontSize: '14px', color: '#546e7a' }}>{`Description: ${selectedEvent.description}`}</Typography>
            <Typography style={{ fontSize: '14px', color: '#546e7a' }}>{`Start: ${selectedEvent.start.toLocaleString()}`}</Typography>
            <Typography style={{ fontSize: '14px', color: '#546e7a' }}>{`End: ${selectedEvent.end.toLocaleString()}`}</Typography>
            <IconButton aria-label="create" color="primary" onClick={handleDeletedEvent}>
              <DeleteIcon />
            </IconButton>
          </Paper>
          
        )}
      </div>
      <AlertSnackbar message={errorMenssage} title={"Calendar Error"} onClose={() => setErrorMessage("")} severity={"error"} />

      <SimpleDialog
        title={'New Event'}
        description={'Enter the information for the new event.'}
        isOpen={openNewDate}
        onClose={() => setOpenNewDate(false)}
        onAccept={handleAddEvent}
      >
        <TextField
          label="Title"
          value={newEventData?.title}
          onChange={(e) => setNewEventData({...newEventData, 'title': e.target.value})}
          fullWidth
        />
        <TextField
          label="Description"
          value={newEventData?.description}
          onChange={(e) => setNewEventData({...newEventData, 'description': e.target.value})}
          fullWidth
        />
      </SimpleDialog>
    </ThemeProvider>
  );
};

export default CalendarView;
