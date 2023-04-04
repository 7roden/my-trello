import { ListAdd } from 'src/common/interfaces/ListAdd';
import { useState, FC } from 'react';
import { isValidTitle } from 'src/common/Modules/Modules';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'src/hook';

type typePropsModalChange = {
  listID?: string;
  titleList: string;
};

const ModalChange: FC<typePropsModalChange> = ({ listID, titleList }) => {
  const boardID = useParams<string>().id;
  const { changeListTitle } = useAppDispatch();
  //console.log('props modalCreate>>', props);
  // const position = useSelector((s: any) =>
  //   s.board.board.lists.filter((list: IList) => list.id === listID)
  // );
  // console.log('position list>>', position.position);
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

  // const keyDownESC = (e: React.KeyboardEvent) => {
  //   e.preventDefault();
  //   console.log('keyDownESC >>', e.target, ' code >>', e.code);
  //   if (e.code === 'Escape') {
  //     setIsVisibleModal(false);
  //     setTitle(titleList);
  //   }
  //   if (e.code === 'NumpadEnter') {changeTitle};
  // };

  // const FormListChange: FC = (): JSX.Element => {
  //   return (
  //     <div className="formListChange">
  //       <form onSubmit={changeTitle} onBlur={changeTitle}>
  //         <input
  //           type="text"
  //           value={title}
  //           onChange={(e) => setTitle(e.target.value)}
  //         />
  //       </form>
  //     </div>
  //   );
  // };

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

export default ModalChange;
