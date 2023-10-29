import { IBoard } from 'IBoard ';
import { FC, useEffect, useState } from 'react';
import { isValidTitle } from 'src/common/Modules/Modules';
import { IBoardHome } from 'IBoardHome';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'src/hook';


const ModalChangeBoard: FC<{ board: IBoard }> = ({ board }) => {
  const [title, setTitle] = useState<string>('');
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const boardID = useParams<string>().boardID;
  const { changeBoard } = useAppDispatch();
  useEffect(() => {
    if (board) {
      setTitle(board.title);
    }
  }, [board]);

  const changeTitle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isValidTitle(title) && title !== board.title) {
      if (title !== board.title) {
        const newBoard: IBoardHome = {
          id: boardID,
          title,
          custom: board.custom,
        };
        changeBoard(newBoard);
      }
      setIsVisibleModal(false);
    }
    if (title === board.title) setIsVisibleModal(false);
  };

  const handleTitle = (e: React.MouseEvent<HTMLElement>) => {
    setIsVisibleModal(true);
  };

  const handleSelected = (e: any) => {
    e.target.select();

  }

  return (
    <>
      {!isVisibleModal ? (
        <h1 className="boardTitle" onClick={handleTitle}>
          {title} boardID:{board.id || 'noooo'}
        </h1>
      ) : (
        <div className="formToChange">
          <form onSubmit={changeTitle} onBlur={changeTitle}>
            <input
              type="text"
              value={title || ''}
              onFocus={handleSelected}
              onChange={(e) => setTitle(e.target.value)}
            />
          </form>
        </div>
      )}
    </>
  );
};

export default ModalChangeBoard;
