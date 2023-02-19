import { useState, FC } from 'react';
import { useParams } from 'react-router-dom';
import { CardAdd } from 'src/common/interfaces/CardAdd';
import { isValidTitle } from 'src/common/Modules/Modules';
import { useAppDispatch } from 'src/hook';

type typePropsCreateCard = {
  listID?: string;
  position: number;
};

const ModalCreateCard: FC<typePropsCreateCard> = ({ listID, position }) => {
  const [title, setTitle] = useState<string>('Enter card name...');
  const boardID = useParams<string>().id;
  const { createCard } = useAppDispatch();
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);

  const handleCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValidTitle(title)) {
      const newCard: CardAdd = {
        title,
        list_id: listID,
        position,
        description: title,
        custom: {},
      };
      createCard(newCard, boardID);
      setTitle('');
      setIsVisibleModal(false);
    }
  };

  const noCreateCard = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setIsVisibleModal(false);
  };

  const buttonAddCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsVisibleModal(true);
  };

  // const FormCreateCard: FC = (): JSX.Element => (
  //   <div className="formCreateCard">
  //     <form onSubmit={handleCard}>
  //       <input value={title} onChange={(e) => setTitle(e.target.value)} />
  //       <button type="submit">Create card</button>
  //       <span className="spanNoCreate" onClick={noCreateCard}>
  //         &times;
  //       </span>
  //     </form>
  //   </div>
  // );

  return (
    <div className='modalCreateCard'>
      {isVisibleModal ? (
        <div className="formCreateCard">
          <form onSubmit={handleCard} onBlur={handleCard} >
            <textarea  value={title} onChange={(e) => setTitle(e.target.value)} onFocus={() => setTitle('')}/>
            <button type="submit">Create card</button>
            <span className="spanNoCreate" onClick={noCreateCard}>
              &times;
            </span>
          </form>
        </div>
      ) : (
        <button className="buttonAddCard" onClick={buttonAddCard}>
          Add card
        </button>
      )}
    </div>
  );
};

export default ModalCreateCard;

/*
title: "to wash a cat",
  list_id: 2,
  position: 5,
  description: "washing process",
  custom: {
    deadline: "2022-08-31 12:00"


    id: ID
title: string
description: string
color: string
custom: any
users: ID[]
created_at: timestamp

*/
