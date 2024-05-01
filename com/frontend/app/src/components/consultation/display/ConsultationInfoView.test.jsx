import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConsutationInfoView from './ConsultationInfoView';
import { act } from 'react-dom/test-utils';


jest.mock('../../../utils/caseTaker.jsx', () => ({
  getConsultation: () => ({
    id: 1,
    client: 123,
    tag: 'Test Tag',
    opponent: 'Test Opponent',
    availability_state: 'CREATED',
    progress_state: 'TODO',
    description: 'Test Description',
    time_stamp: new Date().toISOString(),
  }),
  updateConsultationField: (a,b,c) => ({}),
}));

describe('ConsutationInfoView Component', () => {
  test('renders and allows editing fields', async () => {
    const component = render(<ConsutationInfoView consultation={{ consultation: 1 }} />);

    await waitFor(() => expect(screen.getByText('Etiqueta:')).toBeInTheDocument());

    // Check if the initial consultation data is rendered
    expect(screen.getByText('Etiqueta:')).toBeInTheDocument();
    expect(screen.getByText('Test Tag')).toBeInTheDocument();
    expect(screen.getByText('Oponente:')).toBeInTheDocument();
    expect(screen.getByText('Test Opponent')).toBeInTheDocument();
    expect(screen.getByText('Estado de disponibilidad:')).toBeInTheDocument();
    expect(screen.getByText('Creado, sin asignar')).toBeInTheDocument();
    expect(screen.getByText('Estado de progreso:')).toBeInTheDocument();
    expect(screen.getByText('Por hacer')).toBeInTheDocument();
    expect(screen.getByText('Descripción:')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Tiempo de creación (UTC):')).toBeInTheDocument();

    // Change the value in the edit field
    fireEvent.click(component.container.querySelector("tr:nth-of-type(6) [data-testid='EditIcon']"));
    fireEvent.change(document.getElementById('edit-field-textarea'), { target: { value: 'Updated Tag' } });
    fireEvent.click(document.getElementById("field-save-button"));

    // Check if the field has been updated
    await waitFor(() => expect(screen.getByText('Updated Tag')).toBeInTheDocument());
  });
});
