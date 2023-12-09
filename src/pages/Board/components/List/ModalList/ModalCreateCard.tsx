import { IList } from 'IList';
import { useState, FC } from 'react';
import { useParams } from 'react-router-dom';
import { CardAdd } from 'src/common/interfaces/CardAdd';
import { isValidTitle } from 'src/common/Modules/Modules';
import { useAppDispatch, useAppSelector } from 'src/hook';
import './modalCreateCard.scss';

type typePropsCreateCard = {
  listID: string;
  position: number;
};

const ModalCreateCard: FC<typePropsCreateCard> = ({ listID, position }) => {
  const [title, setTitle] = useState<string>('Enter card name...');
  const boardID = useParams<string>().boardID;
  const { createCard, getBoard } = useAppDispatch();
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [isOnBlur, setIsOnBlur] = useState(true);

  const handleCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValidTitle(title) && isOnBlur) {
      const newCard: CardAdd = {
        title,
        list_id: listID,
        position,
        description: title,
        custom: {},
      };
      await createCard(newCard, boardID);
      await getBoard(boardID || '');
      setTitle('');
      setIsVisibleModal(false);
    }
  };

  const noCreateCard = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setIsVisibleModal(false);
    setIsOnBlur(false);
  };

  const buttonAddCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsVisibleModal(true);
  };

  const onFocusForm = () => {
    setTitle('');
    setIsOnBlur(true);
  };

  return (
    <div className="modalCreateCard">
      {isVisibleModal ? (
        <div className="formCreateCard">
          <form onSubmit={handleCard} onBlur={handleCard}>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={onFocusForm}
            />
            <button type="submit">Create card</button>
            <span className="spanNoCreate" onClick={noCreateCard}>
              &times;
            </span>
          </form>
        </div>
      ) : (
        <span className="buttonAddCard" onClick={buttonAddCard}>
          + Add card
        </span>
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
