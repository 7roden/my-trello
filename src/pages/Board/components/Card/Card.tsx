
import React, { FC, useState } from 'react';
import { FaPencilAlt } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { useAppDispatch } from 'src/hook';

type propsCard = {
  title: string;
  cardID: string;
};

const Card: FC<propsCard> = ({ title, cardID }) => {
  const [isVisibleCardMenu, setIsVisibleCardMenu] = useState(false);
  const { deleteCard } = useAppDispatch();
  const boardID = useParams<string>().id;

  const hover = () => {
    console.log('hover >>>', title);
    setIsVisibleCardMenu(true);
  };

  const noHover = () => {
    console.log('no hover >>>', title);
    setIsVisibleCardMenu(false);
  };

  const clickDeleteCard = () => {
    console.log(
      'clickDeleteCard >>>',
      title,
      ' boardID=',
      boardID,
      ' cardID=',
      cardID
    );
    deleteCard(boardID, cardID);
  };

  const clickCardMenu = () => {
    console.log('card menu click >>>');
  };

  const editCard = () => {
    
  }

  const Menu: FC<{ visible: boolean }> = ({ visible }): JSX.Element => {
    if (!visible) return <div className="cardMenu"></div>;
    return (
      <div className="cardMenu" onClick={clickCardMenu}>
        <Popup
          trigger={
            <div>
              <FaPencilAlt
                className="icons"
                size={'10px'}
                color="red"
                onClick={clickCardMenu}
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
            <div className="menu-item" onClick={editCard}>
              Edit card</div>
          </div>
        </Popup>
      </div>
    );
  };

  return (
    <li onMouseEnter={hover} onMouseLeave={noHover}>
      <div className="card">
        <span>{title}</span>
        <Menu visible={isVisibleCardMenu} />
        {/* <span className="spanDelete">&times;</span> */}
      </div>
    </li>
  );
};

export default Card;
