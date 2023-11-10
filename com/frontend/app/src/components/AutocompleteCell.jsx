import { Autocomplete, TextField } from "@mui/material";

/**
 * A cell component for the Material-UI (MUI) DataGrid table used in renderEditCell.
 * This component is designed to work with fields related to locality, province, and nation.
 *
 * @param {Object} props - The component's properties.
 * @param {Array} props.optionsNameID - The list of options with objects containing 'name' and 'id' properties.
 * @param {Object} props.model - The data model for the cell.
 * @param {function} props.handleChange - The function called when the selected value in the Autocomplete changes.
 *
 * @returns {JSX.Element} - The rendered AutocompleteCell component.
 */
export function AutocompleteCell(props) {
    const nameToIdMap = {};
    props.optionsNameID?.forEach((item) => {
    nameToIdMap[item.name] = item.id;
    });
    return (
        <Autocomplete
        fullWidth
        options={Object.keys(nameToIdMap) || []}
        value={props.model?.name}
        onChange={(event, newValue) => {
            const newID =  nameToIdMap[newValue];
            const newName = newValue;
            props.handleChange(newID, newName);
        }}
        renderInput={(params) => (
            <TextField {...params}/>
        )}
        />
    )
};
