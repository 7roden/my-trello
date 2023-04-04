import { ICard } from 'ICard';
import { IList } from 'IList';
import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { EditCardsType } from 'src/common/Types/CardTypes';
import { useAppDispatch, useAppSelector } from 'src/hook';

type CardDropPropsType = {
  currentCard?: ICard;
  currentList: IList;
  positionDrop?: number;
  onDragEnd: () => void;
};

const CardDropZone: FC<CardDropPropsType> = ({
  currentCard,
  currentList,
  positionDrop,
  onDragEnd,
}): JSX.Element => {
  const { editCards } = useAppDispatch();
  const boardID = useParams<string>().id;
  const { dragedCard, dragedList, dragElementLimits } = useAppSelector(
    (state) => state.slotDnD
  );

  const dropHandler = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    //console.log('current card >>>', currentCard?.title, ' position >>>', positionDrop);
    const data = e.dataTransfer.getData("text");
    console.log('data transfer >>>', data)
    e.currentTarget.classList.remove("dragging")
    if (currentCard !== dragedCard) {
      const dropIndex = dragedList.cards.indexOf(dragedCard);
      dragedList.cards.splice(dropIndex, 1);
      if (currentCard) {
        currentList.cards.splice(positionDrop, 0, dragedCard);
      } else {
        currentList.cards.push(dragedCard);
      }

      const editCardLists: EditCardsType = currentList.cards.map(
        (card: ICard, index: number) => {
          return {
            id: card.id,
            position: index + 1,
            list_id: currentList.id,
          };
        }
      );
      editCards(boardID, editCardLists);
    }
    //onDragOver(e, -1);
    onDragEnd();
  };
  return (
    <>
      <div
        className="dropZone"
        style={{ height: `${dragElementLimits.height}px` }}
        onDrop={(e) => dropHandler(e)}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={onDragEnd}
      ></div>
    </>
  );
};

export default CardDropZone;
