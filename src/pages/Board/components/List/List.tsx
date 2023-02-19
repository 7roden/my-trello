import { ICard } from 'ICard';
import Card from '../Card/Card';
import { useParams } from 'react-router-dom';
import { FC } from 'react';
import ModalChange from './ModalList/ModalChange';
import ModalCreateCard from './ModalList/ModalCreateCard';
import { BsThreeDots } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import { useAppDispatch } from 'src/hook';

type typePropsList = {
  id?: string;
  title: string;
  cards: ICard[];
};

const List: FC<typePropsList> = ({ id, title, cards }) => {
  const { deleteList } = useAppDispatch();
  const listCards: JSX.Element[] = cards.map((card: ICard) => {
    return <Card key={card.id} title={card.title} cardID = {card.id}/>;
  });
  const boardID = useParams<string>().id;
  const clickDeleteList = () => {
    console.log('delete list boardID=',boardID, ' list id=',id)
    deleteList(boardID, id);
  }

  const Menu = ():JSX.Element => (
    <div className="listMenu">
      <Popup
        trigger={
          <div>
            {' '}
            <BsThreeDots size={'15px'} color="red" />
          </div>
        }
        position="right top"
        on="click"
        closeOnDocumentClick
        mouseLeaveDelay={300}
        mouseEnterDelay={0}
        contentStyle={{ padding: '0px', border: 'none' }}
        arrow={false}
      >
        <div className="menu">
          <div className="menu-item" onClick={clickDeleteList}>
            Delete list
          </div>
        </div>
      </Popup>
    </div>
  );

  return (
    <div className="myList">
      <ModalChange listID={id} titleList={title} />
      <Menu />
      <div>
        <ul className="cardList">{listCards}</ul>
        <ModalCreateCard listID={id} position={listCards.length + 1} />
      </div>
    </div>
  );
};

export default List;
