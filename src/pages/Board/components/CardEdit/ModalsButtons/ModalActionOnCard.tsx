import { IBoard } from 'IBoard ';
import { IBoardHome } from 'IBoardHome';
import { ICard } from 'ICard';
import { IList } from 'IList';
import { type } from 'os';
import React, { FC, useEffect, useState } from 'react';
import { SlClose } from 'react-icons/sl';
import { useParams } from 'react-router-dom';
import { getDataBoard } from 'src/common/Modules/Modules';
import {
  EditCardsType,
  ModalCardActionsTypes,
} from 'src/common/Types/CardTypes';
import { CardAdd } from 'src/common/interfaces/CardAdd';
import { useAppDispatch, useAppSelector } from 'src/hook';
import './ButtonsModal.scss';

type PropsModalActionOnCard = {
  isVisibleModal: boolean;
  actionType:
    | ModalCardActionsTypes.CARD_COPYING
    | ModalCardActionsTypes.CARD_MOVEMENT;
  closeModalAction: (isVisibleModal: boolean) => void;
  closeEditCard: () => void;
};

const ModalActionOnCard: FC<PropsModalActionOnCard> = ({
  isVisibleModal,
  actionType,
  closeModalAction,
  closeEditCard,
}) => {
  const boards = useAppSelector<IBoardHome[]>((state) => state.boards.boards);
  const currentBoard = useAppSelector<IBoard>((state) => state.board.board);
  const { card, list } = useAppSelector((state) => state.card);

  const [selectedBoard, setSelectedBoard] = useState(currentBoard);
  const [title, setTitle] = useState(card?.title || 'Назва нової картки');
  const [selectedList, setSelectedList] = useState(list);
  const [selectedCardPosition, setSelectedCardPosition] = useState(
    card?.position
  );

  const { createCard, showModalCard, editCards, deleteCard } = useAppDispatch();

  const { boardID, cardID } = useParams();

  const buttonActionTitle = () => {
    switch (actionType) {
      case ModalCardActionsTypes.CARD_MOVEMENT:
        return 'Перемістити';
      case ModalCardActionsTypes.CARD_COPYING:
        return 'Створити копію';
      default:
        '';
    }
  };

  useEffect(() => {
    if (currentBoard.id === selectedBoard.id) return;
    const firstList: IList = selectedBoard.lists[0];
    setSelectedList(firstList);
    if (firstList) {
      setSelectedCardPosition(firstList.cards.length + 1);
    }
  }, [selectedBoard]);

  const handlerOnChangeBoard = (board_id: string) => {
    if (board_id === currentBoard.id) {
      setSelectedBoard(currentBoard);
      if (list) setSelectedList(list);
      if (card) setSelectedCardPosition(card.position);
    } else {
      getDataBoard(board_id).then(
        (b) => {
          setSelectedBoard(b);
        },
        (e) => {
          alert(e); // оповіщення у разі помилки при отриманні данних з бекенду
        }
      );
    }
  };

  const handlerOnChangeList = (listID: string) => {
    if (listID !== list?.id) {
      const setList = selectedBoard.lists.filter(
        (l: IList) => l.id + '' === listID
      )[0];
      setSelectedList(setList);
      const position = setList.cards.length;
      setSelectedCardPosition(position + 1);
    }
    if (list && listID === list.id) {
      if (card) setSelectedCardPosition(card.position);
    }
  };

  const handlerOnChangeCardPosition = (position: number) => {
    setSelectedCardPosition(position);
  };

  const createEditCardList = (
    cards: ICard[],
    listID: string
  ): EditCardsType => {
    return cards.map((c: ICard, index: number) => {
      return { id: c.id, position: index + 1, list_id: listID };
    });
  };

  const createNewCard = (
    title: string,
    list_id: string,
    position: number
  ): CardAdd => {
    return {
      title,
      list_id,
      position,
      description: title,
      custom: {},
    };
  };

  const cardMovement = () => {
    closeModalAction(false);
    let editCardLists: EditCardsType;
    if (
      selectedList?.id === list?.id &&
      selectedCardPosition === card?.position
    ) {
      return;
    }
    const drawnCard: ICard =
      selectedCardPosition && selectedCardPosition <= selectedList?.cards.length
        ? selectedList?.cards[selectedCardPosition - 1]
        : null;
    const cutCardPosition = list?.cards.indexOf(card);
    list?.cards.splice(cutCardPosition, 1);

    const drawnCardPosition = (cards: ICard[]): number => {
      return drawnCard ? cards.indexOf(drawnCard) : cards.length;
    };

    if (list?.id === selectedList?.id) {
      if (card) list?.cards.splice(drawnCardPosition(list.cards), 0, card);
      editCards(boardID, createEditCardList(list?.cards, list?.id || ''));
      return;
    }

    // new solution
    // let newCards: ICard[] = selectedList?.cards.map((c: ICard) => {
    //   if (selectedCardPosition && c.position >= selectedCardPosition)
    //     c.position++;
    // });
    // if (card) {
    //   const newCard: ICard = { ...card, position: selectedCardPosition || 0 };
    //   newCards = [...newCards, newCard];
    //   newCards = newCards.sort((a: ICard, b: ICard) => {
    //     return a.position - b.position;
    //   });
    //   setSelectedList({ ...selectedList?.cards, cards: newCards });
    // }

    // end new solution

    // old solution
    if (card) {
      selectedList?.cards.splice(
        drawnCardPosition(selectedList.cards),
        0,
        card
      );
    }
    // end old solution
    if (currentBoard.id === selectedBoard.id) {
      // old
      editCardLists = createEditCardList(list?.cards, list?.id || '').concat(
        createEditCardList(selectedList?.cards, selectedList?.id || '')
      );
      //

      // new
      // editCardLists = createEditCardList(list?.cards, list?.id || '').concat(
      //   createEditCardList(selectedList?.cards, selectedList?.id || '')
      // );
      //

      editCards(boardID, editCardLists);
      if (card && selectedList) {
        showModalCard(card, selectedList);
      }
    } else {
      createCard(
        createNewCard(
          card?.title || '',
          selectedList?.id || '',
          selectedCardPosition || 0
        ),
        selectedBoard?.id
      );
      editCardLists = selectedList?.cards
        .filter((c: ICard) => c.id !== card?.id)
        .map((c: ICard, index: number) => {
          let position = index++;
          if (selectedCardPosition && position >= selectedCardPosition)
            position = position++;
          return {
            id: c.id,
            position,
            list_id: selectedList?.id || '',
          };
        });
      editCards(selectedBoard.id, editCardLists);
      editCardLists = list?.cards.map((c: ICard, index: number) => {
        return {
          id: c.id,
          position: index + 1,
          list_id: list?.id || '',
        };
      });
      console.log('editcardsList boardID>>', editCardLists);
      deleteCard(boardID, cardID);
      closeEditCard();
    }
  };

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeModalAction(false);
  };

  function cardCopying() {
    const newCard: CardAdd = {
      title: title,
      list_id: selectedList?.id,
      position: selectedCardPosition || 1,
      description: card?.title || '',
      custom: {},
    };
    createCard(newCard, selectedBoard.id);
  }

  const ActionOnCard: FC = () => {
    switch (actionType) {
      case ModalCardActionsTypes.CARD_MOVEMENT:
        return (
          <div>
            <h3>Перемістити картку</h3>
          </div>
        );
      case ModalCardActionsTypes.CARD_COPYING:
        return (
          <div>
            <h3>Копіювати картку</h3>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            ></textarea>
          </div>
        );
      default:
        return null;
    }
  };

  const definingClassName = () => {
    switch (actionType) {
      case ModalCardActionsTypes.CARD_MOVEMENT:
        return ' cardMovie';
      case ModalCardActionsTypes.CARD_COPYING:
        return ' cardCopy';
      default:
        return '';
    }
  };

  const clickButtonAction = (e: React.MouseEvent) => {
    e.preventDefault();
    switch (actionType) {
      case ModalCardActionsTypes.CARD_MOVEMENT:
        cardMovement();
        return;
      case ModalCardActionsTypes.CARD_COPYING:
        cardCopying();
        return;
      default:
        return;
    }
  };
  return (
    <>
      {isVisibleModal && (
        <div className={`buttonsModal${definingClassName()}`}>
          <ActionOnCard />
          <div className="selectDestination">
            <p>Вибрати місце призначення</p>
            <div className="chooseBoard">
              <label>
                Дошка
                <select
                  name="selectedBoards"
                  value={selectedBoard.id}
                  onChange={(e) => {
                    handlerOnChangeBoard(e.target.value);
                  }}
                >
                  {boards.map((b: IBoardHome) => {
                    return (
                      <option key={b.id} value={`${b.id}`}>
                        {b.title}
                      </option>
                    );
                  })}
                </select>
              </label>
            </div>
            <br />
            <div className="chooseList">
              <label>
                Список
                {selectedList ? (
                  <select
                    name="selectedList"
                    value={selectedList?.id}
                    onChange={(e) => handlerOnChangeList(e.target.value)}
                  >
                    {selectedBoard.lists.map((l: IList) => {
                      return (
                        <option key={l.id} value={l.id}>
                          {l.title}
                        </option>
                      );
                    })}
                  </select>
                ) : (
                  <select>
                    <option value="не має списків">не має списків</option>
                  </select>
                )}
              </label>
            </div>
            <br />
            <div className="choosePositionCard">
              <label>
                Позиція
                {selectedList ? (
                  <select
                    name="selectedPositionCard"
                    value={selectedCardPosition}
                    onChange={(e) =>
                      handlerOnChangeCardPosition(+e.target.value)
                    }
                  >
                    {selectedList.cards.map((c: ICard) => {
                      return (
                        <option key={c.id} value={c.position}>
                          {c.position}
                        </option>
                      );
                    })}
                    <option
                      value={(selectedList ? selectedList.cards.length : 0) + 1}
                    >
                      {(selectedList ? selectedList.cards.length : 0) + 1}
                    </option>
                  </select>
                ) : (
                  <select>
                    <option value="не має списків">не має списків</option>
                  </select>
                )}
              </label>
            </div>
          </div>
          <br />
          <button
            className={`buttonAction${definingClassName()}`}
            onClick={(e) => clickButtonAction(e)}
          >
            {buttonActionTitle()}
          </button>

          <SlClose className="closeModal" onClick={(e) => closeModal(e)} />
        </div>
      )}
    </>
  );
};

export default ModalActionOnCard;
