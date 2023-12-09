import { ICard } from 'ICard';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/hook';
import { SlClose } from 'react-icons/sl';
import { Link } from 'react-router-dom';
import './cardEdit.scss';
import { isValidTitle } from 'src/common/Modules/Modules';
import { IList } from 'IList';
import ModalMoveCard from './ModalsButtons/ModalMoveCard';
import { IBoard } from 'IBoard ';
import { IBoardHome } from 'IBoardHome';
import ModalCopyCard from './ModalsButtons/ModalActionOnCard';
import ModalActionOnCard from './ModalsButtons/ModalActionOnCard';
import { ModalCardActionsTypes } from 'src/common/Types/CardTypes';

type propsCardEditType = {
  card: ICard;
};

const CardEdit = () => {
  const navigate = useNavigate();
  const { boardID, cardID } = useParams();
  const { card, list, isVisibleEditCard } = useAppSelector<{
    card: ICard | null;
    list: IList | null;
    isVisibleEditCard: boolean;
  }>((state) => state.card);
  const board = useAppSelector<IBoard>((state) => state.board.board);
  const boards = useAppSelector<IBoardHome[]>((state) => state.boards.boards);

  const { getBoard, getBoards, showModalCard, hidenModalCard } =
    useAppDispatch();

  const [title, setTitle] = useState(card ? card.title : '');

  const [isVisibleModalMovie, setIsVisibleModalMovie] = useState(false);
  const [isVisibleModalCopy, setIsVisibleModalCopy] = useState(false);

  const [isVisibleChangeTitle, setIsVisibleChangeTitle] =
    useState<boolean>(false);

  useEffect(() => {
    // в цьому випадку не має модального вікна при перезавантаженні сторінки з відкритим модальним вікном
    if (!cardID) return;
    if (!card) {
      board.lists.map((l: IList) => {
        l.cards.map((c: ICard) => {
          if (cardID === c.id + '') {
            showModalCard(c, l);
          }
        });
      });
    }
    if (card) setTitle(card.title);
    if (!boards.length) getBoards();
  }, [card]);

  const [color, setColor] = useState(card ? card.color : '');

  const goBack = () => navigate(-1);

  const closeEditCard = () => {
    goBack();
    hidenModalCard();
    setIsVisibleModalMovie(false);
    setIsVisibleModalCopy(false);
  };

  const keyDownOnDocument = (e: React.KeyboardEvent) => {
    console.log('escape >>>', e.currentTarget);
    if (e.code !== 'Escape') return;
    setIsVisibleModalMovie(false);
    setIsVisibleModalCopy(false);
    goBack();
    hidenModalCard();
  };

  // document.addEventListener('keydown', (e) => keyDownOnDocument(e));

  const handleTitle = () => {
    setIsVisibleChangeTitle(true);
  };

  const changeTitle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValidTitle(title) && title !== card?.title) {
      setIsVisibleChangeTitle(false);
    }
    if (title === card?.title) setIsVisibleChangeTitle(false);
  };

  const keyDownOnChangeTitle = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.code !== 'Escape') return;
    setTitle(card ? card.title : '');
    setIsVisibleChangeTitle(false);
  };

  // manage buttons

  const clickButtonMovieCard = () => {
    setIsVisibleModalMovie(true);
  };

  const clickButtonCoryCard = () => {
    setIsVisibleModalCopy(true);
  };

  const closeModalMovie = (isVisible: boolean) => {
    setIsVisibleModalMovie(isVisible);
  };

  const closeModalCopy = (isVisible: boolean) => {
    setIsVisibleModalCopy(isVisible);
  };

  return (
    <>
      {isVisibleEditCard && (
        <div
          className="modal"
          onClick={closeEditCard}
          onKeyDown={(e) => keyDownOnDocument(e)}
        >
          <div
            className="gridContainer modalEditCard"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="gridItem1 titleEditCard">
              {isVisibleChangeTitle ? (
                <form
                  className="changeTitle"
                  onSubmit={changeTitle}
                  onBlur={changeTitle}
                  onKeyDown={(e) => keyDownOnChangeTitle(e)}
                >
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </form>
              ) : (
                <>
                  {' '}
                  <h3 className="cardTitle" onClick={handleTitle}>
                    {title} cardID:{cardID}
                  </h3>
                  <div className="titleList">
                    <p>in list {list?.title}</p>
                  </div>
                </>
              )}
            </div>
            <div className="gridItem2">
              <form action="">
                <label>Color:</label>
                <input
                  type="text"
                  placeholder="Set color this card"
                  name="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </form>
            </div>
            <div className="gridItem3 buttons">
              <p>Додати до картки</p>
              <div className="buttonLink cardMembers">
                <span className="spanMembers">Members</span>
              </div>
              <div className="buttonLink cardEditLabel">Мітки</div>
              <div className="buttonLink checkList">Перелік</div>
              <div className="buttonLink dataRange">Дати</div>
              <div className="buttonLink cardAttachment">Вкладення</div>
              <div className="buttonLink cardCoverChooser">Обкладинка</div>
              <div className="buttonLink cardUsersFields">
                Користувацькі поля
              </div>
              <p className="addition">Доповнення</p>
              <div className="buttonLink addingAddOns">Додавання доповнень</div>
              <div className="buttonLink automation">Автоматизація</div>
              <div className="buttonLink addNewButton">Додати кнопку</div>
              <p>Дії</p>
              <div
                className="buttonLink moveCard"
                onClick={clickButtonMovieCard}
              >
                Перемістити{' '}
                <ModalActionOnCard
                  isVisibleModal={isVisibleModalMovie}
                  closeModalAction={closeModalMovie}
                  closeEditCard={closeEditCard}
                  actionType={ModalCardActionsTypes.CARD_MOVEMENT}
                />
              </div>
              <div
                className="buttonLink copyCard"
                onClick={clickButtonCoryCard}
              >
                Копіювати
                <ModalActionOnCard
                  isVisibleModal={isVisibleModalCopy}
                  closeModalAction={closeModalCopy}
                  closeEditCard={closeEditCard}
                  actionType={ModalCardActionsTypes.CARD_COPYING}
                />
              </div>
              <div className="buttonLink createTemplate">Створити шаблон</div>
              <div className="buttonLink archiveCard">Архівувати</div>
              <div className="buttonLink shareCard">Поділитися</div>
            </div>
            <SlClose className="closeModal" onClick={closeEditCard} />
          </div>
        </div>
      )}
    </>
  );
};

export default CardEdit;
