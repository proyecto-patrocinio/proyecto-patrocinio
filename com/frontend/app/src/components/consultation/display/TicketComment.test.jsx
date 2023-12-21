import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TicketComment from './TicketComment';

// Mock de las funciones de utilidad
jest.mock('../../../utils/comments.jsx', () => ({
  deleteComment: () => {},
  updateComment: () => {},
  getURLtoDownloadFile: (id) => ({}),
  updateConsultationField: (a,b,c) => ({}),

}));

describe('TicketComment Component', () => {
  test('renders and handles delete, edit, and file download actions', async () => {
    const comment = {
      id: 1,
      text: 'Test comment',
      user: {
        id: 2,
        username: 'TestUser',
      },
      files: [
        {
          id: 3,
          filename: 'test-file.txt',
        },
      ],
    };

    render(<TicketComment comment={comment} />);

    // Check if the component renders properly
    expect(screen.getByText('TestUser')).toBeInTheDocument();
    expect(screen.getByText('Test comment')).toBeInTheDocument();
    expect(screen.getByText('test-file.txt')).toBeInTheDocument();

    // Trigger the edit action
    const MenuButton = screen.getByLabelText("menu-ticket")
    fireEvent.click(MenuButton);
    const editButton = document.getElementById('comment-menu-item-edit')
    fireEvent.click(editButton);

    // Modify the comment text
    fireEvent.change(document.getElementById('edit-comment-area'), { target: { value: 'Updated comment' } });
    fireEvent.click(document.getElementById('comment-edit-confim-button'));
    await waitFor(() => expect(screen.getByText('Updated comment')).toBeInTheDocument());

    // Trigger the delete action
    const deleteButton = document.getElementById("comment-menu-item-delete")
    fireEvent.click(deleteButton);
    await waitFor(() => expect(screen.queryByText('Test comment')).not.toBeInTheDocument());

  });
});
