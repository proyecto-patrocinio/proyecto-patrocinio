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
    expect(screen.getByText('Información de Tablero')).toBeInTheDocument();
    expect(screen.getByText('* 10 consultas totales')).toBeInTheDocument();
    expect(screen.getByText('* 5 consultas por hacer')).toBeInTheDocument();
    expect(screen.getByText('* 3 consultas en progreso')).toBeInTheDocument();
    expect(screen.getByText('* 2 consultas detenidas')).toBeInTheDocument();
    expect(screen.getByText('Logs de Tablero')).toBeInTheDocument();

    expect(screen.queryByText(/Ver Mas/)).toBeNull(); 
    expect(getBoardLogs).toHaveBeenCalledWith(10, panel.id);
  });

});
