import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PhoneNumbersDialog from './PhoneNumbersDialog';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';

describe('PhoneNumbersDialog', () => {
  const mockPhoneNumbers = [
    { id: '1', phone_number: '1234567890' },
    { id: '2', phone_number: '9876543210' },
  ];

  test('renders PhoneNumbersDialog component', async () => {
    const mockOnClose = () => {};
    const mockOnUpdatePhoneNumbers = (listA) => (listA);

    render(
      <PhoneNumbersDialog
        open={true}
        onClose={mockOnClose}
        phoneNumbers={mockPhoneNumbers}
        onUpdatePhoneNumbers={mockOnUpdatePhoneNumbers}
      />
    );

    expect(screen.getByText(/1234567890/)).toBeInTheDocument();
    expect(screen.getByText(/9876543210/)).toBeInTheDocument();

    expect(screen.getByLabelText('Add Phone Number')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Add Phone Number'), { target: { value: '5555555555' } });
    fireEvent.click(document.getElementById('add-phone-button'));

    expect(screen.getByLabelText('Add Phone Number')).toHaveValue('');

  });

});
