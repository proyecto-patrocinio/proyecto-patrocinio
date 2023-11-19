import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import SimpleDialog from './SimpleDialog';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper, TextField, Typography } from '@mui/material';

const theme = createTheme();

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [openNewDate, setOpenNewDate] = useState(false);
  const [events, setEvents] = useState([
    {
      title: 'Cumpleaños de la abuela',
      start: new Date(2023, 11, 13),
      end: new Date(2023, 11, 13),
    },
    // TODO: borrar ejemplo
  ]);

  const [newEventTitle, setNewEventTitle] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);

  const handleSelectSlot = (event) => {
    setNewEventTitle('');
    setSelectedEvent(null);
    setSelectedDates(event);
    setOpenNewDate(true);
  };


  const handleAddEvent = () => {
    if (newEventTitle.trim() !== '') {
      const newEvent = {
        title: newEventTitle,
        start: selectedDates.start,
        end: selectedDates.end,
      };
      setEvents([...events, newEvent]);
      setNewEventTitle('');
      setOpenNewDate(false);
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
            today: 'Hoy',
            next: 'Siguiente',
            previous: 'Anterior',
            month: 'Mes',
            week: 'Semana',
            day: 'Día',
          }}
        />

        {selectedEvent && (
          <Paper style={{ marginTop: '30px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)', background: '#bbdefb', padding: '20px', borderRadius: '8px' }}>
            <Typography variant="h5" style={{ marginBottom: '10px', color: '#2196f3' }}>{selectedEvent.title}</Typography>
            <Typography style={{ fontSize: '14px', color: '#546e7a' }}>{`Inicio: ${selectedEvent.start.toLocaleString()}`}</Typography>
            <Typography style={{ fontSize: '14px', color: '#546e7a' }}>{`Fin: ${selectedEvent.end.toLocaleString()}`}</Typography>
          </Paper>
        )}
      </div>

      <SimpleDialog
        title={'Nuevo Evento'}
        description={'Ingresa el título del nuevo evento:'}
        isOpen={openNewDate}
        onClose={() => setOpenNewDate(false)}
        onAccept={handleAddEvent}
      >
        <TextField
          label="Título del evento"
          value={newEventTitle}
          onChange={(e) => setNewEventTitle(e.target.value)}
          fullWidth
        />
      </SimpleDialog>

    </ThemeProvider>
  );
};

export default CalendarView;
