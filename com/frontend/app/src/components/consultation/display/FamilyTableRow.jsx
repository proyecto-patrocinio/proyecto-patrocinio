import React, { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


/**
 * Functional component for displaying family information in a table row.
 * 
 * @param {Dict} clientData - The client's data containing family information.
 * @returns {JSX.Element} - The FamilyTableRow component JSX. (In TableRow)
 */
const FamilyTableRow = ({clientData}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // If there is no family information, return an empty string.
    if (!clientData?.children){
        return (
            <TableRow>
            <TableCell>Familia:</TableCell>
            <TableCell>0 hijos</TableCell>
            </TableRow>
        );
    }

    /**
     * Toggle the expansion state of the family information.
     */
    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    return (
            <TableRow>
                <TableCell>Familia:</TableCell>
                <TableCell>
                {isExpanded ? (
                    <ul>
                    {clientData.children ? (
                        <ul>
                        {clientData.children.map((child, childIndex) => (
                            <li key={childIndex}>
                            <h4>Hijo {childIndex + 1}:</h4>
                            <ul>
                                <li><strong>Nombre: </strong>{child.first_name}</li>
                                <li><strong>Apellido: </strong>{child.last_name}</li>
                                <li><strong>Tipo de documento: </strong>{child.id_type}</li>
                                <li><strong>Num. de documento: </strong>{child.id_value}</li>
                                <li><strong>Sexo: </strong>{child.sex}</li>
                                <li><strong>Nacimiento: </strong>{child.birth_date}</li>
                                <li><strong>Nacionalidad: </strong>{child.locality.province.nationality.name}</li>
                                <li><strong>Provincia: </strong>{child.locality.province.name}</li>
                                <li><strong>Localidad: </strong>{child.locality.name}</li>
                                <li><strong>Dirección: </strong>{child.address}</li>
                            </ul>
                            </li>
                        ))}
                        </ul>
                    ) : (
                        ""
                    )}
                    </ul>
                ) : (
                    <p>
                    {clientData.children ? clientData.children.length : 0} hijos
                    </p>
                )}
                <Button id="expanded-family-button" variant="outlined" onClick={toggleExpansion}>
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Button>
                </TableCell>
            </TableRow>

    );
};

export default FamilyTableRow;
