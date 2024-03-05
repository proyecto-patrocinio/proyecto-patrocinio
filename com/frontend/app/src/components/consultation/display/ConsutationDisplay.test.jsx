import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConsutationDisplay from './ConsutationDisplay';

// Mock necesario para InfoIcon, CommentIcon y CalendarMonthIcon
jest.mock('@mui/icons-material/Info', () => 'InfoIcon');
jest.mock('@mui/icons-material/Comment', () => 'CommentIcon');
jest.mock('@mui/icons-material/CalendarMonth', () => 'CalendarMonthIcon');

// Mock necesario para Comment y ConsutationInfoView
jest.mock('./CommentView.jsx', () => ({ consultationID }) => (
  <div data-testid="comment-component">Comment Component {consultationID}</div>
));
jest.mock('./ConsultationInfoView.jsx', () => ({ consultation }) => (
  <div data-testid="info-component">Info Component {consultation.id}</div>
));
jest.mock('./CalendarView.jsx', () => ({ cardID }) => (
  <div data-testid="calendar-component">Calendar Component {cardID}</div>
));

describe('ConsutationDisplay Component', () => {
  test('renders and switches between windows', async () => {
    // Render the component
    render(
      <ConsutationDisplay
        consultation={{ consultation: 1, id: 1, panel: 1}}
        open={true}
        onClose={() => {}}
        updateViewTag={() => {}}
      />
    );

    expect(screen.getByText(/Consultation Details/)).toBeInTheDocument();
    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();

    // Verify that the default window is "Info"
    expect(screen.getByTestId('info-component')).toBeInTheDocument();
    expect(screen.queryByTestId('comment-component')).toBeNull();
    expect(screen.queryByTestId('calendar-component')).toBeNull();

    // Switch to "Comments" window
    fireEvent.click(screen.getByText("Comments").closest('button'));
    expect(screen.getByTestId('comment-component')).toBeInTheDocument();
    expect(screen.queryByTestId('info-component')).toBeNull();
    expect(screen.queryByTestId('calendar-component')).toBeNull();

    // Switch to "Calendar" window
    fireEvent.click(screen.getByText('Calendar').closest('button'));
    expect(screen.getByTestId('calendar-component')).toBeInTheDocument();
    expect(screen.queryByTestId('info-component')).toBeNull();
    expect(screen.queryByTestId('comment-component')).toBeNull();

  });
});
