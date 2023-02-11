import { Card, Container, createTheme, CssBaseline, Grid, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Copyright from '../components/Copyright';
import Panel from '../components/Panel';
import Dashboard from '../containers/Dashboard';


const initial_data = {
    tasks: {
        'task-1': { id: 'task-1', content: 'Take out the garbage' },
        'task-2': { id: 'task-2', content: 'Watch my favorite show' },
        'task-3': { id: 'task-3', content: 'Charge my phone' },
        'task-4': { id: 'task-4', content: 'Cook dinner' },
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'To do',
            taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
        },
        'column-2': {
            id: 'column-2',
            title: 'In progress',
            taskIds: [],
        },
        'column-3': {
            id: 'column-3',
            title: 'Done',
            taskIds: [],
        },
    },
   
    // Facilitate reordering of the columns
    columnOrder: ['column-1', 'column-2', 'column-3'],
};

 

const removeFromList = (panel_list, index) => {  
    const panel_array = Array.from(panel_list);  
    const [card_removed] = panel_array.splice(index, 1);  
    return [card_removed, panel_array]  
}  

const addToList = (panel_list, index, card) => {  
    const panel_array = Array.from(panel_list);  
    panel_array.splice(index, 0, card);  
    return panel_array  
}    



export default function Board() {
    const [panels, setPanels] = useState(initial_data.columns);

    useEffect(() => {
        //simulacion API
        setPanels(initial_data.columns);
    }, []);
 

    const onDragEnd = (result) => {  
        if (!result.destination) {  
            return;  
        }  
        const panels_copy = { ...panels }  

        const source_panel = panels_copy[result.source.droppableId];  
        const [card_to_move, new_source_panel] = removeFromList(source_panel, result.source.index) ;
        panels_copy[result.source.droppableId] = new_source_panel  ; 

        const destination_panel = panels_copy[result.destination.droppableId]  
        panels_copy[result.destination.droppableId] = addToList(destination_panel, result.destination.index, card_to_move)  

        setPanels(panels_copy)  
    }

  return (
      <Dashboard>
        <DragDropContext onDragEnd={onDragEnd}>
            {initial_data.columnOrder.map((panel) => (
                <Panel
                // elements={
                //     panel.taskIds.map((taskId) => initial_data.tasks[taskId])
                // }
                id_panel={panel}
                // prefix={panel.title}
                />
            ))}
        </DragDropContext>
    </Dashboard>
  );
}
