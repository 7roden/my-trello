import PropTypes from 'prop-types';
import { ICard } from 'ICard';
import { IList } from 'IList';
import React, { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { elementLimitsType } from 'src/common/Types/CardTypes';
import { useAppDispatch } from 'src/hook';
import CardListMenu from './CardListMenu';

type propsCard = {
  card: ICard;
  list: IList;
  positionCard: number;
  onDragOver: (e: React.DragEvent<HTMLElement>, position: number) => void;
  onDragEnd: () => void;
};

const Card: FC<propsCard> = (props) => {
  const { card, list, positionCard, onDragOver, onDragEnd } = props;
  const { id, title } = card;
  const [isVisibleCardMenu, setIsVisibleCardMenu] = useState(false);
  const { showModalCard, cardDragStart } = useAppDispatch();

  const hover = () => {
    setIsVisibleCardMenu(true);
  };

  const noHover = () => {
    setIsVisibleCardMenu(false);
  };

  const windowEditCard = () => {
    showModalCard(card);
  };

  function positionDropZone(
    e: React.DragEvent<HTMLElement>,
    curentEl: EventTarget & HTMLElement
  ): number {
    const positionDragedCard = { x: e.clientX, y: e.clientY };
    const limitsСurrentСard: elementLimitsType =
      curentEl.getBoundingClientRect();
    let centerY: number =
      limitsСurrentСard.bottom - limitsСurrentСard.height / 2;
    if (
      positionDragedCard.y > centerY &&
      positionDragedCard.y <= limitsСurrentСard.bottom &&
      positionDragedCard.x >= limitsСurrentСard.left &&
      positionDragedCard.x <= limitsСurrentСard.right
    )
      return positionCard + 1;
    return positionCard;
  }

  const dragEnterHandler = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragOverHandler = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    const position = positionDropZone(e, e.currentTarget);
    onDragOver(e, position);
  };

  const dragLeaveHandler = (e: React.DragEvent<HTMLElement>) => {
    const { left, right } = e.currentTarget.getBoundingClientRect();
    const positionX = e.clientX;
    if (positionX < left || positionX > right) onDragEnd();
  };

  const dragEndHandler = () => {
    onDragEnd();
  };

  const dragStartHandler = (e: React.DragEvent<HTMLElement>, card: ICard) => {
    const elLimits: elementLimitsType = e.currentTarget.getBoundingClientRect();
    e.dataTransfer.setData('text/plain', e.currentTarget.id);
    const img = e.currentTarget as Element;
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.setDragImage(img, elLimits.width / 2, elLimits.height / 2);
    const dragElementLimits: elementLimitsType = {
      top: e.clientY - elLimits.top,
      bottom: elLimits.bottom - e.clientY,
      left: e.clientX - elLimits.left,
      right: elLimits.right - e.clientX,
      width: elLimits.width,
      height: elLimits.height,
    };
    cardDragStart(card, list, dragElementLimits);
    return false;
  };

  return (
    <>
      <div
        className="card"
        id={`card${id}`}
        onClick={windowEditCard}
        onMouseEnter={hover}
        onMouseLeave={noHover}
        onDragStart={(e) => dragStartHandler(e, card)}
        onDragEnter={dragEnterHandler}
        onDragOver={dragOverHandler}
        onDragEnd={dragEndHandler}
        onDragLeave={dragLeaveHandler}
        draggable={true}
      >
        <span>{title}</span>
        {isVisibleCardMenu && (
          <CardListMenu list_id={list.id} card_id={card.id} />
        )}
      </div>
    </>
  );
};

export default Card;

// const getNextElement = (cursorPosition: number, currentElement: HTMLLIElement): HTMLLIElement => {
//   // Получаем объект с размерами и координатами
//   const currentElementCoord = currentElement.getBoundingClientRect();
//   // Находим вертикальную координату центра текущего элемента
//   const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2;

//   // Если курсор выше центра элемента, возвращаем текущий элемент
//   // В ином случае — следующий DOM-элемент
//   const nextElement =
//     cursorPosition < currentElementCenter ? currentElement : (currentElement.nextElementSibling as HTMLLIElement);

//   return nextElement;
// };
// const dragOverHandler = (e: React.DragEvent<HTMLLIElement>): void => {
//   e.preventDefault();
// };

// const dragEnterHandler = (e: React.DragEvent<HTMLLIElement>, position: number): void => {
//   e.preventDefault();
//   const activeElement = document.getElementById(activeCard.toString()) as HTMLLIElement;
//   const currentElement = e.currentTarget as HTMLLIElement;
//   const nextElement = getNextElement(e.clientY, currentElement) as HTMLLIElement;
//   // Проверяем, нужно ли менять элементы местами
//   if ((nextElement && activeElement === nextElement.previousElementSibling) || activeElement === nextElement) {
//     return;
//   }
//   console.log(`pos:${position}`);
//   try {
//     document.getElementById(listID.toString())?.insertBefore(activeElement, nextElement);
//     console.log('app-next');
//     console.log(card.id); // верх
//     console.log('app-active');
//     console.log(activeElement); // низ
//   } catch (err) {
//     document.getElementById(listID.toString())?.append(activeElement, nextElement);
//     /*       console.log('aaaaa');
//     console.log(`${nextElement.id}:${card.position}`); // нижний
//     console.log(activeElement.id); // верхний */
//   }
// };
// const dragLeaveHandler = (e: React.DragEvent<HTMLLIElement>): void => {
//   // document.getElementById(e.currentTarget.id.toString())?.classList.add('hidden');
//   // document.getElementById(activeCard.toString())?.classList.add('hidden');
//   console.log(`leave:${e.currentTarget.id}:hhh:${activeCard}`);
//   // document.getElementById('emptyList2')?.remove();
// };

// const dragStartHandler = (e: React.DragEvent<HTMLLIElement>, position: number): void => {
//   onCurrentCard(card.id);
//   onCurrentCardTitle(card.title);
//   console.log(`start:${card.id}`);
//   console.log(`posSt:${position}`);
//   ghostEle = document.createElement('div');
//   ghostEle.classList.add('dragging');
//   ghostEle.id = 'dragging';
//   ghostEle.innerHTML = card.title.toString();

//   document.getElementById(card.id.toString())?.appendChild(ghostEle);
//   setTimeout(() => {
//     const ghostEle2 = document.createElement('p');
//     ghostEle2.classList.add('emptyList2');
//     ghostEle2.id = 'emptyList2';
//     ghostEle2.innerHTML = '';
//     document.getElementById(card.id.toString())?.prepend(ghostEle2);
//     document.getElementById(card.id.toString())?.classList.add('hidden');
//   }, 0);

//   // Customize the drag image
//   e.dataTransfer.setDragImage(ghostEle, 0, 0);
// };

// return !isModalVisible ? (
//   <li
//     className="card list-item"
//     id={card.id.toString()}
//     draggable
//     onDragOver={(e): void => dragOverHandler(e)}
//     onDragLeave={(e): void => dragLeaveHandler(e)}
//     onDragStart={(e): void => dragStartHandler(e, card.position)}
//     onDragEnter={(e): void => dragEnterHandler(e, card.position)}
//     onDoubleClick={(): void => toggleModal()}
//   >
//     <DeleteCard id={card.id} />
//     <InputBlock alertState={alertState} inputData={inputData} />
//     <span>
//       {card.id}:{card.position}
//     </span>
//   </li>
// ) : (
//   <ModalWrapper isModalVisible={isModalVisible} onBackDropClick={toggleModal} isCard card={card} />
// );
// };
