import { Draggable, Droppable } from "react-beautiful-dnd"; 
import React, { useEffect, useState } from "react";  
import Title from "./Title";
import Card from "./Card";
import { Container, List, ListItem } from "@mui/material";


const Panel = ({id_panel}) => {
    const [card_list, setCardList] = useState([])
    const [title_panel, setTitle] = useState("")

    useEffect(  () => async () =>{ 
        let data = await fetch('https://8560c8ef-27c4-48fe-931d-5c4f2081e438.mock.pstmn.io/panel/3'); //First, api call to get data
        let respose = await data.json();
        setTitle(respose.title);
        setCardList(respose.cards)
        return () => {}
        }
    , [])
   
    return ( 
        <Container>
             <h3>{title_panel}</h3>
             <Droppable droppableId={`${id_panel}`}>
             {(provided) => (
                <List {...provided.droppableProps} ref={provided.innerRef} >
                    {card_list.map((card, index) => {
                        return <Card card={card} index={index}/> 
                    })}

                {provided.placeholder}
                </List> 
      )}
            
           </Droppable>
        </Container>
    )
}  

// const Panel = ({ prefix, elements }) => (
   
//     <Droppable droppableId={`${prefix}`}>
//       {(provided) => (
//         <div {...provided.droppableProps} ref={provided.innerRef}>
//           {elements.map((item, index) => (
//             <Card key={item.id} item={item} index={index} />
//           ))}
//           {provided.placeholder}
//         </div>
//       )}
//     </Droppable> 
// );

export default Panel;
