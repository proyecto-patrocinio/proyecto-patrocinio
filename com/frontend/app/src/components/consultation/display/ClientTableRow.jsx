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
                <TableCell>Client:</TableCell>
                <TableCell>{"-"}</TableCell>
            </TableRow>
        );
    }

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };


    return (

        <TableRow>
        <TableCell>Client:</TableCell>
        <TableCell>
        {isExpanded ? (
            <div>

                <TableRow>
                <TableCell>First Name:</TableCell>
                <TableCell>{clientData.first_name}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Last Name:</TableCell>
                <TableCell>{clientData.last_name}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>ID type:</TableCell>
                <TableCell>{clientData.id_type}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>ID Number:</TableCell>
                <TableCell>{clientData.id_number}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Sex:</TableCell>
                <TableCell>{clientData.sex}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Birth date:</TableCell>
                <TableCell>{clientData.birth_date}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Email:</TableCell>
                <TableCell>{clientData.email}</TableCell>
                </TableRow>
                <FamilyTableRow clientData={clientData}/>

                <TableRow>
                <TableCell>Telephones:</TableCell>
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
                <TableCell>Nationality:</TableCell>
                <TableCell>{clientData.locality.province.nationality.name}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>province:</TableCell>
                <TableCell>{clientData.locality.province.name}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Locality:</TableCell>
                <TableCell>{clientData.locality.name}</TableCell>
                </TableRow>

                <TableRow>
                <TableCell>Address:</TableCell>
                <TableCell>{clientData.address}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Postal Code:</TableCell>
                <TableCell>{clientData.postal}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Marital Status:</TableCell>
                <TableCell>{clientData.marital_status}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Housing Type:</TableCell>
                <TableCell>{clientData.housing_type}</TableCell>
                </TableRow>
                <TableRow>
                <TableCell>Studies:</TableCell>
                <TableCell>{clientData.studies}</TableCell>
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
