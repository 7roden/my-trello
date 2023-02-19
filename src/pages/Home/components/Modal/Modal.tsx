import { useState, FC } from 'react';
import { IBoardHome } from 'IBoardHome';
import { useAppDispatch } from 'src/hook';
import { isValidTitle } from 'src/common/Modules/Modules';

const Modal: FC = () => {
  const [title, setTitle] = useState<string>('');
  const { createBoard } = useAppDispatch();
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);

  const handleBoard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const invalidСhar: string = title.replace(/[a-zа-яё0-9\n_.\-\s]/gi, '');
    const id = String(Date.now());
    if (isValidTitle(title)) {
      const newBoard: IBoardHome = {
        id,
        title,
        custom: {},
      };
      createBoard(newBoard);
      setTitle('');
      setIsVisibleModal(false);
    }
  };

  const noCreateBoard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setTitle('');
    setIsVisibleModal(false);
  };

  const addBoard = () => {
    setIsVisibleModal(true);
  };

  return (
    <div className="addBoard">
      {isVisibleModal ? (
        <div className="createBoard">
          <form onSubmit={handleBoard}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            <button type="submit">Create board</button>
            <span className="spanNoCreate" onClick={noCreateBoard}>
              &times;
            </span>
          </form>
        </div>
      ) : (
        <button className="addButton" onClick={addBoard}>
          Add board
        </button>
      )}
    </div>
  );
};

export default Modal;
