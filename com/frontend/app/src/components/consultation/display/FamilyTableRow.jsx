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
    const family = clientData.family;

    // If there is no family information, return an empty string.
    if (family === null){
        return (
            <TableRow>
            <TableCell>Family:</TableCell>
            <TableCell>{"-"}</TableCell>
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
                <TableCell>Family:</TableCell>
                <TableCell>
                {isExpanded ? (
                    <ul>
                    <li><strong>Partner Salary: </strong>${family.partner_salary}</li>
                    <li><strong>Children Information:</strong></li>
                    {family.children ? (
                        <ul>
                        {family.children.map((child, childIndex) => (
                            <li key={childIndex}>
                            <h4>Child {childIndex + 1}:</h4>
                            <ul>
                                <li><strong>First Name: </strong>{child.first_name}</li>
                                <li><strong>Last Name: </strong>{child.last_name}</li>
                                <li><strong>ID Type: </strong>{child.id_type}</li>
                                <li><strong>ID Value: </strong>{child.id_value}</li>
                                <li><strong>Sex: </strong>{child.sex}</li>
                                <li><strong>Birthdate: </strong>{child.birth_date}</li>
                                <li><strong>Nationality: </strong>{child.locality.province.nationality.name}</li>
                                <li><strong>Province: </strong>{child.locality.province.name}</li>
                                <li><strong>Locality: </strong>{child.locality.name}</li>
                                <li><strong>Address: </strong>{child.address}</li>
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
                    <strong>Partner Salary: </strong> ${family.partner_salary}.<br />
                    <strong>Number of children: </strong>{family.children ? family.children.length : 0}
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
