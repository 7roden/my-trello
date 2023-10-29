import { IList } from 'IList';
import { FC } from 'react';
import { BsThreeDots } from 'react-icons/bs';
import Popup from 'reactjs-popup';
import { EditListsType } from 'src/common/Types/ListTypes';
import { useAppDispatch, useAppSelector } from 'src/hook';
import './listMenu.scss'

// list menu

type ListMenuPropsType = {
  boardID: string | undefined;
  listID: string;
};

const ListMenu: FC<ListMenuPropsType> = ({ boardID, listID }): JSX.Element => {
  const { deleteList, editLists } = useAppDispatch();
  const lists = useAppSelector<IList[]>((state) => state.board.board.lists);

  const clickDeleteList = () => {
    deleteList(boardID, listID);
    const newLists: EditListsType = lists
      .filter((list) => list.id !== listID)
      .map((list, index) => {
        list.position = index + 1;
        return { id: list.id, position: list.position };
      });
    editLists(boardID, newLists);
  };
  return (
    <div className="listMenu">
      <Popup
        trigger={
          <div>
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
};

export default ListMenu;
