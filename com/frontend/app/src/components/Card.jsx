import { Card as CardMui } from "@mui/material";
import { Draggable } from "react-beautiful-dnd";  
import Title from "./Title";
 

const Card = ({ card, index }) => {

  return (
    <Draggable key={card.id} draggableId={card.id} index={index}>
      {(provided) => {
          <CardMui
            {...provided.draggableProps}
            ref={provided.innerRef}
            {...provided.dragHandleProps}
          > 
                <Title>{card.tag}</Title>
                <span>Content</span>
          </CardMui>
      }}
    </Draggable>
  );
};
 
export default Card;