import React from 'react';
import {useEffect, useState} from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import {getDataClient} from '../../../utils/client.jsx';
import FamilyTableRow from './FamilyTableRow.jsx';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import {HOUSING_TYPE, MARITAL_STATUS, SEX, STUDIES, ID_TYPE} from './dictionaryEs.jsx';

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
                <TableCell>{ID_TYPE[clientData.id_type]}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Num. de documento:</TableCell>
                <TableCell>{clientData.id_value}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Sexo:</TableCell>
                <TableCell>{SEX[clientData.sex]}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Nacimiento:</TableCell>
                <TableCell>{clientData.birth_date}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Email:</TableCell>
                <TableCell>{clientData.email}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Salario de la pareja:</TableCell>
                <TableCell>{clientData.partner_salary}</TableCell>
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
                <TableCell>{clientData?.locality?.province?.nationality?.name}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Provincia:</TableCell>
                <TableCell>{clientData?.locality?.province?.name}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Localidad:</TableCell>
                <TableCell>{clientData?.locality?.name}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Dirección:</TableCell>
                <TableCell>{clientData?.address}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Código postal:</TableCell>
                <TableCell>{clientData?.postal}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Estado civil:</TableCell>
                <TableCell>{MARITAL_STATUS[clientData?.marital_status]}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Vivienda:</TableCell>
                <TableCell>{HOUSING_TYPE[clientData?.housing_type]}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Estudios:</TableCell>
                <TableCell>{STUDIES[clientData?.studies]}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Empleo:</TableCell>
                <TableCell>{clientData?.employment}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Salario:</TableCell>
                <TableCell>{clientData?.salary}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Ingreso por jubilación:</TableCell>
                <TableCell>{clientData?.amount_retirement}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Ingreso por pensión:</TableCell>
                <TableCell>{clientData?.amount_pension}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Otros ingresos:</TableCell>
                <TableCell>{clientData?.amount_other_income}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Motivo de otros ingresos:</TableCell>
                <TableCell>{clientData?.other_income}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Vehículo:</TableCell>
                <TableCell>{clientData?.vehicle}</TableCell>
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
