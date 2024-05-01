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
    expect(screen.queryByText('Nombre:')).toBeInTheDocument();
    expect(screen.queryByText('Jano')).toBeInTheDocument();
    expect(screen.queryByText('Apellido:')).toBeInTheDocument();
    expect(screen.queryByText('Gonzales')).toBeInTheDocument();
    expect(screen.queryByText('Tipo de documento:')).toBeInTheDocument();
    expect(screen.queryByText('DNI')).toBeInTheDocument();
    expect(screen.queryByText('Num. de documento:')).toBeInTheDocument();
    expect(screen.queryByText('555555555')).toBeInTheDocument();
    expect(screen.queryByText('Sexo:')).toBeInTheDocument();
    expect(screen.queryByText('Masculino')).toBeInTheDocument();
    expect(screen.queryByText('Nacimiento:')).toBeInTheDocument();
    expect(screen.queryByText('2023-12-11')).toBeInTheDocument();
    expect(screen.queryByText('Email:')).toBeInTheDocument();
    expect(screen.queryByText('dummy@gmail.com')).toBeInTheDocument();
    expect(screen.queryByText('Nacionalidad:')).toBeInTheDocument();
    expect(screen.queryByText('Argentina')).toBeInTheDocument();
    expect(screen.queryByText('Provincia:')).toBeInTheDocument();
    expect(screen.queryByText('Catamarca')).toBeInTheDocument();
    expect(screen.queryByText('Localidad:')).toBeInTheDocument();
    expect(screen.queryByText('Departamento de Ambato')).toBeInTheDocument();
    expect(screen.queryByText('Dirección:')).toBeInTheDocument();
    expect(screen.queryByText('dummy address')).toBeInTheDocument();
    expect(screen.queryByText('Código postal:')).toBeInTheDocument();
    expect(screen.queryByText('1234')).toBeInTheDocument();
    expect(screen.queryByText('Estado civil:')).toBeInTheDocument();
    expect(screen.queryByText('Divorciado/a')).toBeInTheDocument();
    expect(screen.queryByText('Vivienda:')).toBeInTheDocument();
    expect(screen.queryByText('Casa')).toBeInTheDocument();
    expect(screen.queryByText('Estudios:')).toBeInTheDocument();
    expect(screen.queryByText('Secundario incompleto')).toBeInTheDocument();
    expect(screen.queryByText('Empleo:')).toBeInTheDocument();
    expect(screen.queryByText('Otros ingresos:')).toBeInTheDocument();
    expect(screen.queryByText('Motivo de otros ingresos:')).toBeInTheDocument();
    expect(screen.queryByText('Ingreso por jubilación:')).toBeInTheDocument();
    expect(screen.queryByText('Ingreso por pensión:')).toBeInTheDocument();
    expect(screen.queryByText('Vehículo:')).toBeInTheDocument();
  });

});
