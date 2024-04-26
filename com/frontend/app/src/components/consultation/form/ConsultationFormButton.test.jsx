import React from 'react';
import { render, screen, fireEvent, waitFor, debug} from '@testing-library/react';
import '@testing-library/jest-dom';
import ConsultationFormButton from './ConsultationFormButton';

jest.mock('../../../utils/caseTaker', () => ({
  createConsultation: (d, o, t, c) => ({
    success: true,
    content: {
        description: d, opponent: o, tag: t, client: c
    }}),
}));

jest.mock('../../../utils/tools', () => ({
  getClientDNI2ID: () => ({ 'DNI123': "123", DNI456: "456" }),
}));

describe('ConsultationFormButton Component', () => {
  test('renders and submits form correctly', async () => {
    // Render the component
    const addNewConsultationMock = (data) => {};
    render(<ConsultationFormButton addNewConsultation={addNewConsultationMock} />);

    // Open the dialog
    expect(screen.queryByText('Cargar nueva consulta')).not.toBeInTheDocument();
    fireEvent.click(document.getElementById("add-icon-button"));
    expect(screen.queryByText('Cargar nueva consulta')).toBeInTheDocument();
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText(/Descripción/), {
      target: { value: 'Test Description' },
    });
    fireEvent.change(screen.getByLabelText(/Oponente/), {
      target: { value: 'Test Opponent' },
    });
    fireEvent.change(screen.getByLabelText(/Etiqueta/), {
      target: { value: 'Test Tag' },
    });
    fireEvent.change(screen.getByLabelText(/Consultante/), {
      target: { value: 'DNI123' }, 
    });

    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByLabelText(/Oponente/).value).toEqual('Test Opponent');
    expect(screen.getByLabelText(/Etiqueta/).value).toEqual('Test Tag');
  });
});
