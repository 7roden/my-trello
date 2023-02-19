import { IBoard } from 'IBoard ';
import { FC, useEffect, useState } from 'react';
import { isValidTitle } from 'src/common/Modules/Modules';
import { IBoardHome } from 'IBoardHome';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'src/hook';

const ModalChangeBoard: FC<{ board: IBoard }> = ({ board }) => {
  const [title, setTitle] = useState<string>('');
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const boardID = useParams<string>().id;
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

  // const FormToChange: FC<{title:string}> = ({title}): JSX.Element => {
  //   return (
  //     <div className="formToChange">
  //       <form onSubmit={changeTitle} onBlur={changeTitle}>
  //         <input
  //           type="text"
  //           value={title || ''}
  //           onChange={(e) => setTitle(e.target.value)}
  //         />
  //       </form>
  //     </div>
  //   );
  // }; not render if title change

  return (
    <div>
      {!isVisibleModal ? (
        <h1 className="boardTitle" onClick={handleTitle}>
          {title} {boardID}
        </h1>
      ) : (
        <div className="formToChange">
        <form onSubmit={changeTitle} onBlur={changeTitle}>
          <input
            type="text"
            value={title || ''}
            onChange={(e) => setTitle(e.target.value)}
          />
        </form>
      </div>
      )}
    </div>
  );
};

export default ModalChangeBoard;
