import { FC } from 'react';
import { Link } from 'react-router-dom';
import { IBoardHome } from 'IBoardHome';
import { BsThreeDots } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import { useAppDispatch } from 'src/hook';

const Board: FC<IBoardHome> = ({ id, title }) => {
const { deleteBoard, getBoards } = useAppDispatch();
const deleteBoardHome = () => {
  console.log('delete board id=',id)
  deleteBoard(id);
}

  const Menu = () => (
    <div className="boardMenu">
      <Popup
        trigger={<div> <BsThreeDots  size={'15px'} color="red" /></div>}
        position="right top"
        on="click"
        closeOnDocumentClick
        mouseLeaveDelay={300}
        mouseEnterDelay={0}
        contentStyle={{ padding: '0px', border: 'none' }}
        arrow={false}
      >
        <div className="menu">
          <div className="menu-item" onClick={deleteBoardHome}> Delete board</div>
        </div>
      </Popup>
    </div>
  );
  return (
    <Link to={`/board/${id}`}>
      <div className="board">
        <h5>{title}</h5>
        <Menu />
      </div>
    </Link>
  );
};

export default Board;
