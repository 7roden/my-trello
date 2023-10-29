import { IBoard } from 'IBoard ';
import { IBoardHome } from 'IBoardHome';
import { IList } from 'IList';
import React, { FC, useEffect, useState } from 'react';
import { SlClose } from 'react-icons/sl';
import { useAppDispatch, useAppSelector } from 'src/hook';
import './ButtonsModal.scss';
import { useParams } from 'react-router-dom';
import { resolve } from 'path';
import api from 'src/api';
import { getDataBoard } from 'src/common/Modules/Modules';
import { ICard } from 'ICard';
import { click } from '@testing-library/user-event/dist/click';
import { EditCardsType } from 'src/common/Types/CardTypes';
import { CardAdd } from 'src/common/interfaces/CardAdd';

type typePropsMoveCard = {
  isVisibleModal: boolean;
  closeModalMovie: (isVisibleModal: boolean) => void;
  closeEditCard: () => void;
};

const ModalMoveCard: FC<typePropsMoveCard> = ({
  isVisibleModal,
  closeModalMovie,
  closeEditCard,
}) => {
  const boards = useAppSelector<IBoardHome[]>((state) => state.boards.boards);
  const currentBoard = useAppSelector<IBoard>((state) => state.board.board);
  const { boardID, cardID } = useParams();

  const [selectedBoard, setSelectedBoard] = useState(currentBoard);

  const { card, list } = useAppSelector((state) => state.card);
  const [selectedList, setSelectedList] = useState(list);
  const [selectedCardPosition, setSelectedCardPosition] = useState(
    card?.position
  );
  const { editCards, deleteCard, createCard, showModalCard } =
    useAppDispatch();

  useEffect(() => {
    if (currentBoard.id === selectedBoard.id) return;
    const firstList: IList = selectedBoard.lists[0];
    setSelectedList(firstList);
    if (firstList) {
      setSelectedCardPosition(firstList.cards.length + 1);
    }
  }, [selectedBoard]);

  useEffect(() => {
    setSelectedList(list);
  }, [list?.cards]);

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

  const clickRunCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeModalMovie(false);
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

    if (list?.id === selectedList?.id) {
      const drawnCardPosition = drawnCard
        ? list?.cards.indexOf(drawnCard)
        : list?.cards.length;
      if (card) list?.cards.splice(drawnCardPosition, 0, card);
      editCardLists = list?.cards.map((c: ICard, index: number) => {
        return {
          id: c.id,
          position: index + 1,
          list_id: list?.id || '',
        };
      });
      console.log(
        'editcardsList list?.id === selectedList?.id >>',
        editCardLists,
        ', drawnCardPosition >>',
        drawnCardPosition
      );
      editCards(boardID, editCardLists);
      return;
    } else {
      const drawnCardPosition = drawnCard
        ? selectedList?.cards.indexOf(drawnCard)
        : selectedList?.cards.length;
      if (card) selectedList?.cards.splice(drawnCardPosition, 0, card);
      console.log(' drawnCardPosition >>', drawnCardPosition);
    }
    if (currentBoard.id === selectedBoard.id) {
      editCardLists = list?.cards
        .map((c: ICard, index: number) => {
          return {
            id: c.id,
            position: index + 1,
            list_id: list?.id || '',
          };
        })
        .concat(
          selectedList?.cards.map((c: ICard, index: number) => {
            return {
              id: c.id,
              position: index + 1,
              list_id: selectedList?.id || '',
            };
          })
        );
      editCards(boardID, editCardLists);
      if (card && selectedList) {
        showModalCard(card, selectedList);
      }
    } else {
      const newCard: CardAdd = {
        title: card?.title || '',
        list_id: selectedList?.id,
        position: selectedCardPosition || 1,
        description: card?.title || '',
        custom: {},
      };
      createCard(newCard, selectedBoard?.id);
      editCardLists = selectedList?.cards
        .filter((c: ICard) => c.id !== card?.id)
        .map((c: ICard, index: number) => {
          let position = index++;
          if (selectedCardPosition && position >= selectedCardPosition)
            position = position++;
          console.log('position >>', position);
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
    closeModalMovie(false);
  };

  return (
    <>
      {isVisibleModal && (
        <div className="buttonsModal cardMovie">
          <h3>Перемістити картку</h3>
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
          <button className="buttonRunMove" onClick={(e) => clickRunCard(e)}>
            Перемістити
          </button>
          <SlClose className="closeModal" onClick={(e) => closeModal(e)} />
        </div>
      )}
    </>
  );
};

export default ModalMoveCard;
