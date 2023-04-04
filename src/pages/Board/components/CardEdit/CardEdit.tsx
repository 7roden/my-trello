import { ICard } from 'ICard';
import { FC, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from 'src/hook';
import { SlClose } from 'react-icons/sl';

type propsCardEditType = {
  card: ICard;
};

const CardEdit: FC<propsCardEditType> = ({ card }) => {

  //console.log('card in cardEdit', card);

  const boardID = useParams<string>().id;
  const [title, setTitle] = useState(card.title);

  const { hidenModalCard } = useAppDispatch();

  const closeEditCard = () => {
    hidenModalCard();
  };

  return (
    <div className='modalEditCard' >
      <form action="">
        <input
          type="text"
          placeholder=''
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </form>
      <SlClose className="closeModal" onClick={closeEditCard} />
    </div>
  );
};

export default CardEdit;
