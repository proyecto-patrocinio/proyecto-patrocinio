import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalendarView from './CalendarView';

// Mock the functions used in the component
jest.mock('../../../utils/calendar', () => ({
  getCalendarByCard: jest.fn(() => Promise.resolve({ events: [], id: 1 })),
  createEvent: jest.fn(() => Promise.resolve({ id: 2, title: 'Test Event' })),
  deleteEvent: jest.fn(() => Promise.resolve()),
}));

// Mock the SimpleDialog component
jest.mock('../../SimpleDialog', () => ({ title, description, isOpen, onClose, onAccept }) => {
  return (
    isOpen && (
      <div>
        <div>{title}</div>
        <div>{description}</div>
        <button onClick={onClose}>Close</button>
        <button onClick={onAccept}>Accept</button>
      </div>
    )
  );
});

describe('CalendarView', () => {
  test('renders the component', async () => {
    render(<CalendarView cardID={1} />);
    // Assertions based on component's rendering
    expect(screen.getByText('Hoy')).toBeInTheDocument();
    expect(screen.getByText('Siguiente')).toBeInTheDocument();
    expect(screen.getByText('Anterior')).toBeInTheDocument();
    expect(screen.getByText('Mes')).toBeInTheDocument();
    expect(screen.getByText('Semana')).toBeInTheDocument();
    expect(screen.getByText('Día')).toBeInTheDocument();
  });


});
