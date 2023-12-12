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
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Day')).toBeInTheDocument();
  });


});
