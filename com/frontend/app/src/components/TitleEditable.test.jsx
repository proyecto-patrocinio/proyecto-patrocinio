import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TitleEditable from './TitleEditable';
import '@testing-library/jest-dom';

describe('TitleEditable', () => {
  test('renders TitleEditable component', () => {
    const mockSaveTitle = jest.fn();

    render(<TitleEditable title="Test Title" saveTitle={mockSaveTitle} />);

    // Double click to enter edit mode
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    fireEvent.doubleClick(screen.getByText('Test Title'));

    // Check if the input field is rendered in edit mode
    const inputField = screen.getByRole('textbox');
    expect(inputField).toBeInTheDocument();
    expect(inputField).toHaveFocus();

    // Update title
    fireEvent.change(inputField, { target: { value: 'New Title' } });
    fireEvent.blur(inputField);

    expect(mockSaveTitle).toHaveBeenCalledWith('New Title');
    expect(inputField).not.toBeInTheDocument();
  });
});
