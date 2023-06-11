import { FC } from 'react';
import { Link } from 'react-router-dom';
import { IBoardHome } from 'IBoardHome';
import { BsThreeDots } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import { useAppDispatch } from 'src/hook';

const Board: FC<IBoardHome> = ({ id, title }) => {
  const { deleteBoard } = useAppDispatch();
  const deleteBoardHome = () => {
    console.log('delete board id=', id);
    deleteBoard(id);
  };

  const clickMenu = (e: React.MouseEvent) => {
    console.log('sdfsdfdf');
    e.stopPropagation();
  };

  const Menu = (): JSX.Element => (
    <div className="boardMenu">
      <Popup
        trigger={
          <div>
            <BsThreeDots onClick={clickMenu} size={'15px'} color="red" />
          </div>
        }
        position="right top"
        on="hover"
        closeOnDocumentClick
        closeOnEscape
        mouseLeaveDelay={300}
        mouseEnterDelay={0}
        contentStyle={{ padding: '0px', border: 'none' }}
        arrow={false}
      >
        <div className="menu">
          <div className="menu-item" onClick={deleteBoardHome}>
            Delete board
          </div>
        </div>
      </Popup>
    </div>
  );
  return (
      <div className="board">
        <h5>{title}</h5>
        <Menu />
      </div>
  );
};

export default Board;
