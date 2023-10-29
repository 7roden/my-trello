import { ICard } from 'ICard';
import { IList } from 'IList';
import { FC } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { EditCardsType } from 'src/common/Types/CardTypes';
import { useAppDispatch, useAppSelector } from 'src/hook';
import './cardListMenu.scss';
import { Link } from 'react-router-dom';

type CardListMenuPropsType = {
  list_id: string;
  card_id: string;
};

// menu in the card
const CardListMenu: FC<CardListMenuPropsType> = ({
  list_id,
  card_id,
}): JSX.Element => {
  const { deleteCard, editCards, showModalCard } = useAppDispatch();
  const boardID = useParams<string>().boardID;
  const list = useAppSelector<IList>(
    (state) => state.board.board.lists.filter((list) => list.id === list_id)[0]
  );
  const card: ICard = list.cards.filter((c: ICard) => c.id === card_id)[0];

  const clickCardMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const windowEditCard = () => {
    showModalCard(card, list);
  };

  const clickDeleteCard = () => {
    deleteCard(boardID, card_id);
    const editCardLists: EditCardsType = list.cards
      .filter((currentCard: ICard) => currentCard.id !== card_id)
      .map((currentCard: ICard, index: number) => {
        return { id: currentCard.id, position: index + 1, list_id };
      });
    console.log('editCardLists >>', editCardLists);
    editCards(boardID, editCardLists);
  };

  return (
    <div className="cardMenu" onClick={clickCardMenu}>
      <Popup
        trigger={
          <div>
            <FaPencilAlt
              className="icons"
              size={'10px'}
              color="red"
              onClick={(e) => clickCardMenu(e)}
            />
          </div>
        }
        position="right top"
        on="click"
        closeOnDocumentClick
        mouseLeaveDelay={300}
        mouseEnterDelay={0}
        contentStyle={{ padding: '0px', margin: 'auto', border: 'none' }}
        arrow={false}
      >
        <div className="menu">
          <div className="menu-item" onClick={clickDeleteCard}>
            Delete card
          </div>
          <Link to={`/board/${boardID}/card/${card_id}`}>
            <div className="menu-item" onClick={windowEditCard}>
              Edit card
            </div>
          </Link>
        </div>
      </Popup>
    </div>
  );
};

export default CardListMenu;
