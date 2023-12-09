import { IBoard } from 'IBoard ';
import { IBoardHome } from 'IBoardHome';
import { ICard } from 'ICard';
import { IList } from 'IList';
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

  let currentList: IList = { ...list } as IList;
  let currentCard: ICard = { ...card } as ICard;

  const [selectedBoard, setSelectedBoard] = useState({ ...currentBoard });
  const [title, setTitle] = useState(card?.title || 'Назва нової картки');
  const [selectedList, setSelectedList] = useState({ ...list });
  const currentCardPosition: number = card ? card.position : 1;
  const [selectedCardPosition, setSelectedCardPosition] =
    useState(currentCardPosition);

  const { createCard, showModalCard, editCards, deleteCard, getBoard } =
    useAppDispatch();

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
    const { id, title, cards, position } = selectedList;
    console.log('useEffect currentCard >>', currentCard.position)
    showModalCard(currentCard, {
      id: id || '',
      title: title || '',
      cards: cards.map((c: ICard, index: number) => {
        return { ...c, position: index + 1 };
      }),
      position: position || 0,
    });
  }, [currentCard.position]);

  const handlerOnChangeBoard = (board_id: string) => {
    if (board_id === currentBoard.id) {
      setSelectedBoard({ ...currentBoard });
      setSelectedList({ ...list });
      setSelectedCardPosition(currentCardPosition);
    } else {
      getDataBoard(board_id).then(
        (b) => {
          setSelectedBoard(b);
          const firstList: IList = { ...b.lists[0] };
          setSelectedList(firstList);
          setSelectedCardPosition(firstList.cards.length + 1);
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
      setSelectedList({ ...setList });
      const position = setList.cards.length;
      setSelectedCardPosition(position + 1);
    }
    if (list && listID === list.id) {
      setSelectedCardPosition(currentCardPosition);
    }
  };

  const handlerOnChangeCardPosition = (position: number) => {
    setSelectedCardPosition(position);
  };

  const createEditCardList = (cards: ICard[], listID: string): EditCardsType =>
    cards.map((c: ICard, index: number) => {
      return { id: c.id, position: index + 1, list_id: listID };
    });

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

  const cardMovement = async () => {
    closeModalAction(false);
    let editCardLists: EditCardsType;
    if (
      selectedList?.id === currentList?.id &&
      selectedCardPosition === currentCardPosition
    ) {
      return;
    }
    const drawnCard: ICard = selectedList?.cards[selectedCardPosition - 1];
    currentList.cards.splice(currentCardPosition - 1, 1);

    if (currentList.id === selectedList.id) {
      currentCard = { ...currentCard, position: selectedCardPosition };
      currentList.cards.splice(selectedCardPosition - 1, 0, currentCard);
      await editCards(
        boardID,
        createEditCardList(currentList.cards, currentList.id || '')
      );
      // await showModalCard(currentCard, currentList)
      await getBoard(boardID || '');
      return;
    }

    const cards = [...selectedList.cards];
    cards.splice(selectedCardPosition - 1, 0, currentCard);
    setSelectedList({
      ...selectedList,
      cards: [...cards],
    });

    if (currentBoard.id === selectedBoard.id) {
      editCardLists = createEditCardList(
        currentList.cards,
        currentList.id || ''
      ).concat(createEditCardList(cards, selectedList.id || ''));

      await editCards(boardID, editCardLists);

      // if (selectedList) {
      //   const { id, title, cards, position } = selectedList;
      //   await showModalCard(currentCard, {
      //     id: id || '',
      //     title: title || '',
      //     cards: cards,
      //     position: position || 0,
      //   });
      // }
    } else {
      await createCard(
        createNewCard(
          currentCard.title || '',
          selectedList.id || '',
          selectedCardPosition
        ),
        selectedBoard?.id
      );
      editCardLists = cards
        .filter((c: ICard) => c.id !== currentCard.id)
        .map((c: ICard, index: number) => {
          let position = index++;
          if (position >= selectedCardPosition) position = position++;
          return {
            id: c.id,
            position: index + (c.position >= selectedCardPosition ? 2 : 1),
            list_id: selectedList?.id || '',
          };
        });
      await editCards(selectedBoard.id, editCardLists);
      editCardLists = currentList?.cards.map((c: ICard, index: number) => {
        return {
          id: c.id,
          position: index + 1,
          list_id: list?.id || '',
        };
      });
      await deleteCard(boardID, cardID);
      closeEditCard();
    }
    await getBoard(boardID || '');
  };

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeModalAction(false);
  };

  function cardCopying() {
    const newCard: CardAdd = {
      title: title,
      list_id: selectedList?.id,
      position: selectedCardPosition ? selectedCardPosition - 1 : 1,
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
                    {selectedList.id !== currentList.id && (
                      <option
                        value={
                          (selectedList ? selectedList.cards.length : 0) + 1
                        }
                      >
                        {(selectedList ? selectedList.cards.length : 0) + 1}
                      </option>
                    )}
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
