import { useParams } from 'react-router-dom';
import React, { FC, useState, DragEvent, useEffect } from 'react';
import ModalChange from './ModalList/ModalChange';
import { useAppDispatch, useAppSelector } from 'src/hook';
import { IList } from 'IList';
import ListMenu from './ListMenu';
import { RootState } from 'src/store/store';
import { ICard } from 'ICard';
import ModalCreateCard from './ModalList/ModalCreateCard';
import CardListMenu from '../Card/CardListMenu';
import { EditCardsType, elementLimitsType } from 'src/common/Types/CardTypes';

type typePropsList = {
  list: IList;
};

const List: FC<typePropsList> = ({ list }) => {
  const { title, cards, id } = list;
  const { cardDragStart, editCards } = useAppDispatch();
  const boardID = useParams<string>().id;
  const [isVisibleCardMenu, setIsVisibleCardMenu] = useState<boolean[]>(
    cards.map(() => false).concat(false)
  );

  const { dragedCard, dragedList, dragElementLimits } = useAppSelector(
    (state) => state.slotDnD
  );

  const [isVisibleDropZone, setIsVisibleDropZone] = useState<boolean[]>(
    cards.map(() => false).concat(false)
  );

  useEffect(() => {
    setIsVisibleDropZone(cards.map(() => false).concat(false));
  }, [cards]);

  // visible card menu
  const hover = (positionCard: number) => {
    setIsVisibleCardMenu(
      isVisibleCardMenu.map((b: boolean, index: number) => {
        if (index === positionCard) return true;
        return false;
      })
    );
  };

  const noHover = () => {
    setIsVisibleCardMenu(isVisibleCardMenu.map(() => false));
  };

  // drag and drop

  const onDragEndHandler = (e: DragEvent<HTMLElement>) => {
    e.currentTarget.classList.remove('dragging');
    setIsVisibleDropZone(cards.map(() => false).concat(false));
  };

  const positionDropZone = (
    e: DragEvent<HTMLElement>,
    cardPosition: number
  ) => {
    const { top, height } = e.currentTarget.getBoundingClientRect();
    const centerCurrentCard = top + height / 2;
    if (e.clientY < centerCurrentCard) {
      setIsVisibleDropZone(
        isVisibleDropZone.map((visible, index) => {
          if (index === cardPosition - 1) return true;
          return false;
        })
      );
    }
    if (e.clientY >= centerCurrentCard) {
      setIsVisibleDropZone(
        isVisibleDropZone.map((visible, index) => {
          if (index === cardPosition) return true;
          return false;
        })
      );
    }
  };

  const onDragEnterHandler = (
    e: DragEvent<HTMLElement>,
    currentCard: ICard
  ) => {
    e.preventDefault();
    if (currentCard.id === dragedCard.id) return;
    positionDropZone(e, currentCard.position);
  };

  const dragEnterCardsHandler = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    if (!cards.length) {
      setIsVisibleDropZone([true]);
    }
    if (cards.length === 1 && cards[0] === dragedCard) {
      setIsVisibleDropZone([false, true]);
    }
  };

  const dragOverHandler = (e: DragEvent<HTMLElement>, currentCard: ICard) => {
    e.preventDefault();
    if (currentCard.id === dragedCard.id && cards.length > 1) return;
    positionDropZone(e, currentCard.position);
  };

  const dragStartHandler = (e: DragEvent<HTMLElement>, card: ICard) => {
    const dragElement: HTMLElement = e.currentTarget;
    const elLimits: elementLimitsType = dragElement.getBoundingClientRect();
    e.dataTransfer.setData('text/plain', dragElement.id);
    const img: HTMLElement = e.currentTarget;
    e.dataTransfer.setDragImage(img, elLimits.width / 2, elLimits.height / 2);
    const dragElementLimits: elementLimitsType = {
      top: e.clientY - elLimits.top,
      bottom: elLimits.bottom - e.clientY,
      left: e.clientX - elLimits.left,
      right: elLimits.right - e.clientX,
      width: elLimits.width,
      height: elLimits.height,
    };

    setTimeout(() => {
      dragElement.classList.add('dragging');
    }, 0);
    cardDragStart(card, list, dragElementLimits);
  };

  const dragLeaveCardsHandler = (e: DragEvent<HTMLElement>) => {
    const { top, right, bottom, left } =
      e.currentTarget.getBoundingClientRect();
    const positionX = e.clientX;
    const positionY = e.clientY;
    if (
      positionX >= left &&
      positionX <= right &&
      positionY >= top &&
      positionY <= bottom
    )
      return;
    setIsVisibleDropZone(isVisibleDropZone.map((v) => false));
  };

  const dropHandler = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drop');
    e.currentTarget.classList.remove('dragging');
    const currentCard: ICard = cards[isVisibleDropZone.indexOf(true)];
    if (currentCard === dragedCard) return;
    const dropIndex = dragedList.cards.indexOf(dragedCard);
    dragedList.cards.splice(dropIndex, 1);
    if (currentCard) {
      const positionDrop = list.cards.indexOf(currentCard);
      list.cards.splice(positionDrop, 0, dragedCard);
    } else {
      list.cards.push(dragedCard);
    }
    let editCardLists: EditCardsType = list.cards.map(
      (card: ICard, index: number) => {
        return {
          id: card.id,
          position: index + 1,
          list_id: list.id,
        };
      }
    );
    if (list.id !== dragedList.id) {
      editCardLists = editCardLists.concat(
        dragedList.cards.map((card: ICard, index: number) => {
          return {
            id: card.id,
            position: index + 1,
            list_id: dragedList.id,
          };
        })
      );
    }
    editCards(boardID, editCardLists);
    setIsVisibleDropZone(cards.map(() => false).concat(false));
  };

  return (
    <div className="listCards">
      <ModalChange listID={id} titleList={title} />
      <ListMenu boardID={boardID} listID={list.id} />
      {
        <div
          className="cards"
          onDragLeave={dragLeaveCardsHandler}
          onDrop={dropHandler}
          onDragEnter={dragEnterCardsHandler}
        >
          {cards
            .sort((a: ICard, b: ICard) => a.position - b.position)
            .map((card: ICard, index: number) => {
              return (
                <div key={card.id} className="cardContainer">
                  {isVisibleDropZone[index] && (
                    <div
                      className="card dropZone"
                      style={{ height: `${dragElementLimits.height}px` }}
                      onDragOver={(e) => e.preventDefault()}
                    ></div>
                  )}
                  <div
                    className="card"
                    id={`card${card.id}`}
                    onMouseEnter={() => hover(index)}
                    onMouseLeave={noHover}
                    onDragStart={(e) => dragStartHandler(e, card)}
                    onDragEnter={(e) => onDragEnterHandler(e, card)}
                    onDragEnd={onDragEndHandler}
                    onDragOver={(e) => dragOverHandler(e, card)}
                    draggable={true}
                  >
                    {card.title}
                    {isVisibleCardMenu[index] && (
                      <CardListMenu list_id={list.id} card_id={card.id} />
                    )}
                  </div>
                </div>
              );
            })}
          {isVisibleDropZone[cards.length] && (
            <div
              className="card dropZone"
              style={{ height: `${dragElementLimits.height}px` }}
              onDragOver={(e) => e.preventDefault()}
            ></div>
          )}

          <ModalCreateCard listID={list.id} position={list.cards.length + 1} />
        </div>
      }
    </div>
  );
};

export default List;
