import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FamilyTableRow from './FamilyTableRow';

describe('FamilyTableRow Component', () => {
  test('renders with no family information', () => {
    const clientData = { children: [] };
    render(<FamilyTableRow clientData={clientData} />);

    // Ensure that the component renders properly when there is no family information
    expect(screen.getByText('Familia:')).toBeInTheDocument();
  });

  test('renders with expanded family information', () => {
    const clientData = {
        children: [
          {
            birth_date: '2000-01-01',
            locality: {
              province: {
                nationality: { name: 'Nationality1' },
                name: 'Province1',
              },
              name: 'Locality1',
            },
            address: 'Address1',
            id_type: 'DNI',
            id_value: '12345678',
            sex: 'MALE',
            first_name: 'Dummy',
            last_name: 'Dummy',
          },
        ],
    };

    render(<FamilyTableRow clientData={clientData} />);

    // Ensure that the component renders properly with expanded family information
    expect(screen.getByText('Familia:')).toBeInTheDocument();
    expect(screen.getByText(/1 hijos/)).toBeInTheDocument();

    fireEvent.click(document.getElementById("expanded-family-button"))
    expect(screen.getByText('Hijo 1:')).toBeInTheDocument();
    expect(screen.getByText(/Nacimiento:/)).toBeInTheDocument();
    expect(screen.getByText(/2000-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/Nacionalidad:/)).toBeInTheDocument();
    expect(screen.getByText(/Nationality1/)).toBeInTheDocument();
    expect(screen.getByText(/Provincia:/)).toBeInTheDocument();
    expect(screen.getByText(/Province1/)).toBeInTheDocument();
    expect(screen.getByText(/Localidad:/)).toBeInTheDocument();
    expect(screen.getByText(/Locality1/)).toBeInTheDocument();
    expect(screen.getByText(/Dirección:/)).toBeInTheDocument();
    expect(screen.getByText(/Address1/)).toBeInTheDocument();
  });

  test('toggles expansion when button is clicked', () => {
    const clientData = {
        children: [
          {
            birth_date: '2000-01-01',
            locality: {
              province: {
                nationality: { name: 'Nationality1' },
                name: 'Province1',
              },
              name: 'Locality1',
            },
            address: 'Address1',
          },
        ],
    };

    render(<FamilyTableRow clientData={clientData} />);

    // Ensure that the component starts in a collapsed state
    expect(screen.queryByText('Hijo 1:')).toBeNull();

    // Click the button to toggle expansion
    fireEvent.click(screen.getByRole('button'));

    // Ensure that the component is now in an expanded state
    expect(screen.getByText('Hijo 1:')).toBeInTheDocument();
  });
});
