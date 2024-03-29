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
    availability_state: 'Available',
    progress_state: 'TODO',
    description: 'Test Description',
    time_stamp: new Date().toISOString(),
  }),
  updateConsultationField: (a,b,c) => ({}),
}));

describe('ConsutationInfoView Component', () => {
  test('renders and allows editing fields', async () => {
    const component = render(<ConsutationInfoView consultation={{ consultation: 1 }} />);

    await waitFor(() => expect(screen.getByText('Tag:')).toBeInTheDocument());

    // Check if the initial consultation data is rendered
    expect(screen.getByText('Tag:')).toBeInTheDocument();
    expect(screen.getByText('Test Tag')).toBeInTheDocument();
    expect(screen.getByText('Opponent:')).toBeInTheDocument();
    expect(screen.getByText('Test Opponent')).toBeInTheDocument();
    expect(screen.getByText('Availability State:')).toBeInTheDocument();
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByText('Progress State:')).toBeInTheDocument();
    expect(screen.getByText('TODO')).toBeInTheDocument();
    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Creation time stamp (UTC):')).toBeInTheDocument();

    // Change the value in the edit field
    fireEvent.click(component.container.querySelector("tr:nth-of-type(6) [data-testid='EditIcon']"));
    fireEvent.change(document.getElementById('edit-field-textarea'), { target: { value: 'Updated Tag' } });
    fireEvent.click(document.getElementById("field-save-button"));

    // Check if the field has been updated
    await waitFor(() => expect(screen.getByText('Updated Tag')).toBeInTheDocument());
  });
});
