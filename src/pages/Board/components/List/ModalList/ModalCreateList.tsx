import { useState, FC } from 'react';
import { useParams } from 'react-router-dom';
import { ListAdd } from 'src/common/interfaces/ListAdd';
import { isValidTitle } from 'src/common/Modules/Modules';
import { useAppDispatch } from 'src/hook';
import './modalCreateList.scss'

const ModalCreateList = (props: any) => {
  const [title, setTitle] = useState<string>('Enter list name...');
  const boardID = useParams<string>().boardID;
  const { createList } = useAppDispatch();
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);

  const handleList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { position } = props;
    if (isValidTitle(title)) {
      const newList: ListAdd = {
        boardID,
        title,
        position,
      };
      createList(newList);
      setTitle('');
      setIsVisibleModal(false);
    }
  };

  const noCreateList = (e: React.MouseEvent<HTMLSpanElement>) => {
    setIsVisibleModal(false);
    setTitle('');
    e.preventDefault();
  };

  const clickAddList = (e: React.MouseEvent<HTMLHeadElement>) => {
    setIsVisibleModal(true);
    setTitle('Enter list name...');
  };

  return (
    <div className="modalCreateList">
      {isVisibleModal ? (
        <div className="formCreateList">
          <form onSubmit={handleList} onBlur={handleList}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setTitle('')}
            />
            <button type="submit">Create list</button>
            <span className="spanNoCreate" onClick={noCreateList}>
              &times;
            </span>
          </form>
        </div>
      ) : (
        <span className="buttonAddList" onClick={clickAddList}>
          + Add list
        </span>
      )}
    </div>
  );
};

export default ModalCreateList;
