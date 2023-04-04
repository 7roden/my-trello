import { ICard } from 'ICard';
import { IList } from 'IList';
import { FC, useState } from 'react';
import { useAppSelector } from 'src/hook';
import { RootState } from 'src/store/store';
import ModalCreateCard from '../List/ModalList/ModalCreateCard';
import Card from './Card';
import CardDropZone from './CardDropZone';

type ListCardsPropsType = {
  listID: string;
};

const ListCards: FC<ListCardsPropsType> = ({ listID }): JSX.Element => {
  const list = useAppSelector<IList>(
    (state: RootState) =>
      state.board.board.lists.filter((list: IList) => list.id === listID)[0]
  );

  const [isVisibleDropZone, setIsVisibleDropZone] = useState<boolean[]>(
    list.cards.map(() => false).concat(false)
  );

  const handleSetVisible = (
    e: React.DragEvent<HTMLElement>,
    position: number
  ) => {
    if (e.currentTarget.className === 'card') {
      setIsVisibleDropZone(
        isVisibleDropZone.map((isDrop: boolean, index: number) => {
          if (index === position) return true;
          return false;
        })
      );
      //e.preventDefault();
    }
  };

  const onDragEndHandler = () => {
    setIsVisibleDropZone(list.cards.map(() => false).concat(false));
  };
  //console.log('visible map >>', isVisibleDropZone);

  return (
    <div className="cards">
      {list.cards.map((card: ICard, index: number) => {
        return (
          <div className='cardContainer' key={card.id}>
            {isVisibleDropZone[index] && (
              <CardDropZone
                currentList={list}
                currentCard={card}
                positionDrop={index}
                onDragEnd={onDragEndHandler}
              />
            )}
            <Card
              card={card}
              list={list}
              positionCard={index}
              onDragOver={handleSetVisible}
              onDragEnd={onDragEndHandler}
            />
          </div>
        );
      })}
      {isVisibleDropZone[isVisibleDropZone.length - 1] && (
        <CardDropZone currentList={list} onDragEnd={onDragEndHandler} />
      )}

      <ModalCreateCard listID={listID} position={list.cards.length + 1} />
    </div>
  );
};

export default ListCards;
