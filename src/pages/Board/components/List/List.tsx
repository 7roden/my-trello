import { useParams } from 'react-router-dom';
import React, { FC, useState } from 'react';
import ModalChange from './ModalList/ModalChange';

import { useAppDispatch, useAppSelector } from 'src/hook';
import { IList } from 'IList';
import ListMenu from './ListMenu';
//import ListCards from '../Card/ListCards';
import { RootState } from 'src/store/store';
import { ICard } from 'ICard';
import CardDropZone from '../Card/CardDropZone';
import Card from '../Card/Card';
import ModalCreateCard from './ModalList/ModalCreateCard';

type typePropsList = {
  list: IList;
};

const List: FC<typePropsList> = ({ list }) => {
  const { title, cards, id } = list;
  const { deleteList, editLists, getBoard } = useAppDispatch();
  const boardID = useParams<string>().id;
  //const lists = useAppSelector<IList[]>((state) => state.board.board.lists);

  const [isVisibleDropZone, setIsVisibleDropZone] = useState<boolean[]>(
    cards.map(() => false).concat(false)
  );

  //console.log('visible map >>', isVisibleDropZone);

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
    setIsVisibleDropZone(cards.map(() => false).concat(false));
  };

  const onDragEnterHandler = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    //e.stopPropagation();
    if (!cards.length) {
      setIsVisibleDropZone(isVisibleDropZone.map(() => true));
    }
  };

  const onDragLeaveHandler = () => {
    setIsVisibleDropZone(isVisibleDropZone.map(() => false));
  };

  const ListCards: FC = (): JSX.Element => {
    return (
      <div
        className="cards"
        onDragEnter={onDragEnterHandler}
        onDragLeave={onDragLeaveHandler}
      >
        {cards.map((card: ICard, index: number) => {
          return (
            <div key={card.id}>
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
        {isVisibleDropZone[cards.length] && (
          <CardDropZone currentList={list} onDragEnd={onDragEndHandler} />
        )}

        <ModalCreateCard listID={list.id} position={list.cards.length + 1} />
      </div>
    );
  };

  return (
    <div className="myList">
      <ModalChange listID={id} titleList={title} />
      <ListMenu boardID={boardID} listID={list.id} />
      <ListCards />
    </div>
  );
};

export default List;
