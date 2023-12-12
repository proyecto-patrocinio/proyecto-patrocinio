import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import BoardInfo from './BoardInfo';
import { getBoardLogs } from '../utils/caseTaker';
import '@testing-library/jest-dom';

jest.mock('../utils/caseTaker', () => ({
  getBoardLogs: jest.fn(() => Promise.resolve([])),
}));

describe('BoardInfo', () => {

  /**
   * Verifies that the BoardInfo component renders correctly.
   */
  test('renders BoardInfo component', async () => {
    const panel = {
      id: '1',
      number_cards: 10,
      todo_count: 5,
      in_progress_count: 3,
      paused_count: 1,
      blocked_count: 1,
    };

    render(<BoardInfo panel={panel} />);
    act(() => {
        // Simulate a click on the board info button
        fireEvent.click(document.getElementById('board-info-button-1'));
    });

    /* assert on the output */
    expect(screen.getByText('Board Information')).toBeInTheDocument();
    expect(screen.getByText('* 10 total cards')).toBeInTheDocument();
    expect(screen.getByText('* 5 cards to do')).toBeInTheDocument();
    expect(screen.getByText('* 3 cards in progress')).toBeInTheDocument();
    expect(screen.getByText('* 2 cards stopped')).toBeInTheDocument();
    expect(screen.getByText('Board Logs')).toBeInTheDocument();

    expect(screen.queryByText(/Show More/)).toBeNull(); 
    expect(getBoardLogs).toHaveBeenCalledWith(10, panel.id);
  });

});
