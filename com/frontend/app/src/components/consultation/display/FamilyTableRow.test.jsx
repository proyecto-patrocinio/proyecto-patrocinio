import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FamilyTableRow from './FamilyTableRow';

describe('FamilyTableRow Component', () => {
  test('renders with no family information', () => {
    const clientData = { family: null };
    render(<FamilyTableRow clientData={clientData} />);

    // Ensure that the component renders properly when there is no family information
    expect(screen.getByText('Family:')).toBeInTheDocument();
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  test('renders with expanded family information', () => {
    const clientData = {
      family: {
        partner_salary: 50000,
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
      },
    };

    render(<FamilyTableRow clientData={clientData} />);

    // Ensure that the component renders properly with expanded family information
    expect(screen.getByText('Family:')).toBeInTheDocument();
    expect(screen.getByText(/Partner Salary:/)).toBeInTheDocument();
    expect(screen.getByText(/50000/)).toBeInTheDocument();
    expect(screen.getByText(/Number of children:/)).toBeInTheDocument();
    expect(screen.getByText(/1/)).toBeInTheDocument();

    fireEvent.click(document.getElementById("expanded-family-button"))
    expect(screen.getByText('Child 1:')).toBeInTheDocument();
    expect(screen.getByText(/Birthdate:/)).toBeInTheDocument();
    expect(screen.getByText(/2000-01-01/)).toBeInTheDocument();
    expect(screen.getByText(/Nationality:/)).toBeInTheDocument();
    expect(screen.getByText(/Nationality1/)).toBeInTheDocument();
    expect(screen.getByText(/Province:/)).toBeInTheDocument();
    expect(screen.getByText(/Province1/)).toBeInTheDocument();
    expect(screen.getByText(/Locality:/)).toBeInTheDocument();
    expect(screen.getByText(/Locality1/)).toBeInTheDocument();
    expect(screen.getByText(/Address:/)).toBeInTheDocument();
    expect(screen.getByText(/Address1/)).toBeInTheDocument();
  });

  test('toggles expansion when button is clicked', () => {
    const clientData = {
      family: {
        partner_salary: 50000,
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
      },
    };

    render(<FamilyTableRow clientData={clientData} />);

    // Ensure that the component starts in a collapsed state
    expect(screen.queryByText('Child 1:')).toBeNull();

    // Click the button to toggle expansion
    fireEvent.click(screen.getByRole('button'));

    // Ensure that the component is now in an expanded state
    expect(screen.getByText('Child 1:')).toBeInTheDocument();
  });
});
