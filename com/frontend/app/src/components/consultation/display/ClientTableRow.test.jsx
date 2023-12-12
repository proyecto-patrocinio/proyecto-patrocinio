import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientTableRow from './ClientTableRow';
import { waitFor } from '@testing-library/react';



// Mock the getDataClient function
jest.mock('../../../utils/client.jsx', () => ({
    getDataClient: () => ({
      "id": 1,
      "locality": {
          "id": 824,
          "name": "Departamento de Ambato",
          "province": {
              "id": 3647,
              "name": "Catamarca",
              "nationality": {
                  "id": 11,
                  "name": "Argentina"
              }
          }
      },
      "patrimony": null,
      "tels": [],
      "family": null,
      "first_name": "Jano",
      "last_name": "Gonzales",
      "id_type": "DOCUMENT",
      "id_value": "555555555",
      "sex": "MALE",
      "birth_date": "2023-12-11",
      "address": "dummy address",
      "postal": 1234,
      "marital_status": "DIVORCED",
      "housing_type": "HOUSE",
      "studies": "INCOMPLETE_SECONDARY",
      "email": "dummy@gmail.com"
  }),
  }));


describe('ClientTableRow', () => {
  test('renders client information when expanded', async () => {
    render(<ClientTableRow clientID={1} />);
    await waitFor(() => {
        screen.getByText(/Jano/);
    });

    // Simulate clicking the expansion button
    expect(screen.getByRole('button')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button'));

    // Check if the component collapses when button is clicked
    expect(screen.queryByText('First Name:')).toBeInTheDocument();
    expect(screen.queryByText('Jano')).toBeInTheDocument();
    expect(screen.queryByText('Last Name:')).toBeInTheDocument();
    expect(screen.queryByText('Gonzales')).toBeInTheDocument();
    expect(screen.queryByText('ID Type:')).toBeInTheDocument();
    expect(screen.queryByText('DOCUMENT')).toBeInTheDocument();
    expect(screen.queryByText('ID Value:')).toBeInTheDocument();
    expect(screen.queryByText('555555555')).toBeInTheDocument();
    expect(screen.queryByText('Sex:')).toBeInTheDocument();
    expect(screen.queryByText('MALE')).toBeInTheDocument();
    expect(screen.queryByText('Birthdate:')).toBeInTheDocument();
    expect(screen.queryByText('2023-12-11')).toBeInTheDocument();
    expect(screen.queryByText('Email:')).toBeInTheDocument();
    expect(screen.queryByText('dummy@gmail.com')).toBeInTheDocument();
    expect(screen.queryByText('Nationality:')).toBeInTheDocument();
    expect(screen.queryByText('Argentina')).toBeInTheDocument();
    expect(screen.queryByText('province:')).toBeInTheDocument();
    expect(screen.queryByText('Catamarca')).toBeInTheDocument();
    expect(screen.queryByText('Locality:')).toBeInTheDocument();
    expect(screen.queryByText('Departamento de Ambato')).toBeInTheDocument();
    expect(screen.queryByText('Address:')).toBeInTheDocument();
    expect(screen.queryByText('dummy address')).toBeInTheDocument();
    expect(screen.queryByText('Postal Code:')).toBeInTheDocument();
    expect(screen.queryByText('1234')).toBeInTheDocument();
    expect(screen.queryByText('Marital Status:')).toBeInTheDocument();
    expect(screen.queryByText('DIVORCED')).toBeInTheDocument();
    expect(screen.queryByText('Housing Type:')).toBeInTheDocument();
    expect(screen.queryByText('HOUSE')).toBeInTheDocument();
    expect(screen.queryByText('Studies:')).toBeInTheDocument();
    expect(screen.queryByText('INCOMPLETE_SECONDARY')).toBeInTheDocument();
    expect(screen.queryByText('Patrimony:')).toBeInTheDocument();
    expect(screen.queryByText('Employment:')).toBeInTheDocument();
    expect(screen.queryByText('Other Income:')).toBeInTheDocument();
    expect(screen.queryByText('Amount Other Income:')).toBeInTheDocument();
    expect(screen.queryByText('Amount Retirement:')).toBeInTheDocument();
    expect(screen.queryByText('Amount Pension:')).toBeInTheDocument();
    expect(screen.queryByText('Vehicle:')).toBeInTheDocument();
  });

});
