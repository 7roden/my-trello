import { ListAdd } from 'src/common/interfaces/ListAdd';
import { useState, FC } from 'react';
import { isValidTitle } from 'src/common/Modules/Modules';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'src/hook';

type typePropsModalChangeTitleCard = {
  listID?: string;
  titleList: string;
};

const ModalChangeTitleCard: FC<typePropsModalChangeTitleCard> = ({ listID, titleList }) => {
  const boardID = useParams<string>().boardID;
  const { changeListTitle } = useAppDispatch();

  const [title, setTitle] = useState<string>(titleList || '');
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const changeTitle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('changeTitle >>', e.target);
    if (isValidTitle(title) && title !== titleList) {
      if (title !== titleList) {
        const newList: ListAdd = {
          listID,
          boardID,
          title,
        };
        changeListTitle(newList);
      }
      setIsVisibleModal(false);
    }
    if (title === titleList) setIsVisibleModal(false);
  };

  const handleTitle = () => {
    setIsVisibleModal(true);
  };

  return (
    <>
      {isVisibleModal ? (
        <div className="formListChange">
          <form
            onSubmit={changeTitle}
            onBlur={changeTitle}
            // onKeyDown={keyDownESC}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </form>
        </div>
      ) : (
        <h3 className="listTitle" data-id={`${listID}`} onClick={handleTitle}>
          {titleList}
        </h3>
      )}
    </>
  );
};

export default ModalChangeTitleCard;
