import React from 'react';
import {useEffect, useState} from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {getDataClient} from '../../../utils/client.jsx';
import FamilyTableRow from './FamilyTableRow.jsx';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';


/**
 * Functional component for displaying client information in a table row.
 * 
 * @param {string} clientID - The ID of the client to display.
 * @returns {JSX.Element} - The ClientTableRow component JSX.
 */
const ClientTableRow = ({clientID}) => {
    const [clientData, setClient] = useState(null)
    const [isExpanded, setIsExpanded] = useState(false);


    /**
     * Fetch client data based on the provided client ID.
     */
	useEffect(() => {
		const fetchConsultancy = async () => {
            const clientResponse = await getDataClient(clientID)
            setClient(clientResponse)
        };

        fetchConsultancy();

    }, [clientID]);


    /**
     * Toggle the expansion state of the client information.
     */
    if (clientData == null) {
        return (
            <TableRow>
                <TableCell>Consultante:</TableCell>
                <TableCell>{"-"}</TableCell>
            </TableRow>
        );
    }

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };


    return (

        <TableRow>
        <TableCell>Consultante:</TableCell>
        <TableCell>
        {isExpanded ? (
            <div>

                <TableRow>
                <TableCell>Nombre:</TableCell>
                <TableCell>{clientData.first_name}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Apellido:</TableCell>
                <TableCell>{clientData.last_name}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Tipo de documento:</TableCell>
                <TableCell>{clientData.id_type}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Num. de documento:</TableCell>
                <TableCell>{clientData.id_value}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Sexo:</TableCell>
                <TableCell>{clientData.sex}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Nacimiento:</TableCell>
                <TableCell>{clientData.birth_date}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Email:</TableCell>
                <TableCell>{clientData.email}</TableCell>
                </TableRow>
                <FamilyTableRow clientData={clientData}/>

                <TableRow>
                <TableCell>Teléfono:</TableCell>
                <TableCell>
                {clientData.tels.length > 0 ? (
                    <ul>
                        {clientData.tels.map((telephone, index) => (
                        <li key={index}>{telephone.phone_number}</li>
                        ))}
                    </ul>
                    ) : (
                    " - "
                )}
                </TableCell>
                </TableRow>

                <TableRow>
                <TableCell>Nacionalidad:</TableCell>
                <TableCell>{clientData.locality.province.nationality.name}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Provincia:</TableCell>
                <TableCell>{clientData.locality.province.name}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Localidad:</TableCell>
                <TableCell>{clientData.locality.name}</TableCell>
                </TableRow>

                <TableRow>
                <TableCell>Dirección:</TableCell>
                <TableCell>{clientData.address}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Código postal:</TableCell>
                <TableCell>{clientData.postal}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Estado civil:</TableCell>
                <TableCell>{clientData.marital_status}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Vivienda:</TableCell>
                <TableCell>{clientData.housing_type}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Estudios:</TableCell>
                <TableCell>{clientData.studies}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Patrimonio:</TableCell>
                <TableCell>
                <ul>
                    <li key={1}>
                    <strong>Empleo: </strong>
                    {clientData?.patrimony?.employment}
                    </li>
                    <li key={2}>
                    <strong>Salario: </strong>
                    {clientData?.patrimony?.salary}
                    </li>
                    <li key={3}>
                    <strong>Otros ingresos: </strong>
                    {clientData?.patrimony?.other_income}
                    </li>
                    <li key={4}>
                    <strong>Ingreso por otros ingresos: </strong>
                    {clientData?.patrimony?.amount_other_income}
                    </li>
                    <li key={5}>
                    <strong>Ingreso por jubilación: </strong>
                    {clientData?.patrimony?.amount_retirement}
                    </li>
                    <li key={6}>
                    <strong>Ingreso por pensión: </strong>
                    {clientData?.patrimony?.amount_pension}
                    </li>
                    <li key={7}>
                    <strong>Vehículo: </strong>
                    {clientData?.patrimony?.vehicle}
                    </li>
                </ul>
                </TableCell>
                </TableRow>
            </div>
                ) : (
                    <p>{clientData.first_name} {clientData.last_name}</p>
                )}
                <Button variant="outlined" onClick={toggleExpansion}>
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Button>
                </TableCell>
            </TableRow>

    );
};

export default ClientTableRow;
