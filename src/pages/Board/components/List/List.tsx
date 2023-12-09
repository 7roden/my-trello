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
import './list.scss';
import Slot from '../../Slot/Slot';
import { Link } from 'react-router-dom';

type typePropsList = {
  list: IList;
  listDragStartHandler: (
    e: DragEvent<HTMLElement>,
    listPosition: number
  ) => void;
  listDragEnterHandler: (e: DragEvent<HTMLElement>, listID: string) => void;
  listDragEndHandler: (e: DragEvent<HTMLElement>, listID: string) => void;
};

const List: FC<typePropsList> = ({
  list,
  listDragStartHandler,
  listDragEndHandler,
  listDragEnterHandler,
}) => {
  const { title, cards, id } = list;
  const { cardDragStart, cardDragEnd, editCards, showModalCard, getBoard } =
    useAppDispatch();
  const { isVisibleEditCard } = useAppSelector((state) => state.card);
  const elementBody: HTMLElement | null = document.querySelector('body');
  if (elementBody)
    elementBody.style.overflow = isVisibleEditCard ? 'hidden' : 'auto';
  const boardID = useParams<string>().boardID;
  const [isVisibleCardMenu, setIsVisibleCardMenu] = useState<boolean[]>(
    cards.map(() => false).concat(false)
  );

  let { dragedCard, dragedList, dragElementLimits } = useAppSelector(
    (state) => state.slotDnD
  );

  const [isVisibleDropZone, setIsVisibleDropZone] = useState<boolean[]>(
    cards.map(() => false).concat(false)
  );

  useEffect(() => {
    setIsVisibleDropZone(cards.map(() => false).concat(false));
  }, [dragedList]);

  // visible card menu
  const hover = (positionCard: number): void => {
    setIsVisibleCardMenu(
      isVisibleCardMenu.map((b: boolean, index: number) => {
        if (index === positionCard) return true;
        return false;
      })
    );
  };

  const noHover = (): void => {
    setIsVisibleCardMenu(isVisibleCardMenu.map(() => false));
  };

  const windowEditCard = (card: ICard): void => {
    showModalCard(card, list);
  };
  // drag and drop

  const onDragEndHandler = (e: DragEvent<HTMLElement>): void => {
    e.currentTarget.classList.remove('dragging');
    setIsVisibleDropZone(cards.map(() => false).concat(false));
    cardDragEnd();
  };

  const positionDropZone = (
    e: DragEvent<HTMLElement>,
    cardPosition: number
  ): void => {
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
  ): void => {
    e.preventDefault();
    if (!dragedCard) return;
    if (currentCard.id === dragedCard.id) return;
    positionDropZone(e, currentCard.position);
  };

  const dragEnterCardsHandler = (e: DragEvent<HTMLElement>): void => {
    e.preventDefault();
    if (!dragedCard) return;
    if (!cards.length) {
      setIsVisibleDropZone([true]);
    }
    if (cards.length === 1 && cards[0] === dragedCard) {
      setIsVisibleDropZone([false, true]);
    }
  };

  const dragOverHandler = (
    e: DragEvent<HTMLElement>,
    currentCard: ICard
  ): void => {
    e.preventDefault();
    if (!dragedCard) return;
    if (currentCard.id === dragedCard.id && cards.length > 1) return;
    positionDropZone(e, currentCard.position);
  };

  const dragStartHandler = (e: DragEvent<HTMLElement>, card: ICard): void => {
    e.stopPropagation();
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

  const dragLeaveCardsHandler = (e: DragEvent<HTMLElement>): void => {
    if (!dragedCard) return;
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

  const dropHandler = async (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    if (!dragedCard || !dragedList) return;
    e.currentTarget.classList.remove('drop');
    e.currentTarget.classList.remove('dragging');
    const currentCard: ICard = cards[isVisibleDropZone.indexOf(true)];
    if (currentCard === dragedCard) return;
    const dropIndex = dragedList.cards.indexOf(dragedCard);
    let newCards: ICard[] = [...dragedList.cards];
    newCards.splice(dropIndex, 1);
    dragedList = { ...dragedList, cards: newCards };
    if (currentCard) {
      const positionDrop = list.cards.indexOf(currentCard);
      newCards = [...list.cards];
      newCards.splice(positionDrop, 0, dragedCard);
      list = { ...list, cards: newCards };
    } else {
      list = { ...list, cards: [...list.cards, dragedCard] };
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
            list_id: dragedList?.id,
          };
        })
      );
    }
    await editCards(boardID, editCardLists);
    await getBoard(boardID || '')
    setIsVisibleDropZone(cards.map(() => false).concat(false));
  };

  // Dnd for list

  function handlerListDragStart(
    e: DragEvent<HTMLElement>,
    listPosition: number
  ): void {
    listDragStartHandler(e, listPosition);
  }

  function handlerListDragEnd(e: DragEvent<HTMLElement>, listID: string): void {
    listDragEndHandler(e, listID);
  }

  function handlerListDragEnter(
    e: DragEvent<HTMLElement>,
    listID: string
  ): void {
    listDragEnterHandler(e, listID);
  }

  return (
    <div
      className="listCards"
      id={`list${list.id}`}
      draggable="true"
      onDragStart={(e) => handlerListDragStart(e, list.position - 1)}
      onDragEnter={(e) => handlerListDragEnter(e, list.id)}
      onDragEnd={(e) => handlerListDragEnd(e, list.id)}
    >
      <ModalChange listID={id} titleList={title} />
      <ListMenu boardID={boardID} listID={list.id} />
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
                  <Slot
                    className={'card dropZone'}
                    style={{
                      height: `${dragElementLimits?.height}px`,
                      width: `${dragElementLimits?.width}px`,
                    }}
                  ></Slot>
                )}
                <Link to={`/board/${boardID}/card/${card.id}`}>
                  <div
                    className="card"
                    id={`card${card.id}`}
                    onClick={() => windowEditCard(card)}
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
                </Link>
              </div>
            );
          })}
        {isVisibleDropZone[cards.length] && (
          <Slot
            className={'card dropZone'}
            style={{
              height: `${dragElementLimits?.height}px`,
              width: `${dragElementLimits?.width}px`,
            }}
          ></Slot>
        )}
        <ModalCreateCard listID={list.id} position={list.cards.length + 1} />
      </div>
    </div>
  );
};

export default List;
