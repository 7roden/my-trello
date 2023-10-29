import React, { useState, useEffect, FC, DragEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import './board.scss';
import List from './components/List/List';
import ModalCreateList from './components/List/ModalList/ModalCreateList';
import { IList } from 'IList';
import ModalChangeBoard from 'src/pages/Board/components/ModalChangeBoard';
import { useAppDispatch, useAppSelector } from 'src/hook';
import ProgressBar from '../Home/components/Board/ProgressBar';
import Swal from 'sweetalert2';
import { connect } from 'react-redux';
import CardEdit from './components/CardEdit/CardEdit';
import Slot from './Slot/Slot';
import { IBoard } from 'IBoard ';
import { IBoardHome } from 'IBoardHome';

const Board: FC = () => {
  const { boardID } = useParams<string>();
  const { getBoard, clearError, getBoards } = useAppDispatch();
  const { board, loading, error } = useAppSelector((state) => state.board);
  const boards: IBoardHome[] = useAppSelector((state) => state.boards.boards);
  const { card, isVisibleEditCard } = useAppSelector((state) => state.card);
  let [lists, setLists] = useState<IList[]>([]);
  const [isVisibleDropZone, setIsVisibleDropZone] = useState<boolean[]>(
    lists.map(() => false).concat(false)
  );
  let listElements: HTMLElement[] = [];

  useEffect(() => {
    if (boardID) getBoard(boardID);
    //if (!boards.length) getBoards();
  }, [boardID]);

  useEffect(() => {
    if (board?.title) {
      setLists(board.lists);
      setIsVisibleDropZone(lists.map(() => false).concat(false));
    }
  }, [board]);

  const [draggedList, setDraggedList] = useState<IList | null>(null);
  const [draggedElementSize, setDraggedElementSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  if (loading) {
    return <ProgressBar />;
  }

  if (error) {
    Swal.fire('ERROR', error, 'error');
    clearError();
  }

  // list Dnd
  let draggedElement: HTMLElement | null = null;

  const findListElements = () => {
    return Array.from(document.querySelectorAll('.listCards')) as HTMLElement[];
  };

  const dragOverHandler = (e: DragEvent<HTMLElement>): void => {
    e.preventDefault();
    listElements = findListElements();
    //if (listElements.length === board.lists.length) return;
    //console.log('listDragOvertHandler');
    const positionX = e.clientX;
    let indexDrop = lists.length;
    let p = 0;
    listElements.forEach((e: HTMLElement, index: number) => {
      const { left, width } = e.getBoundingClientRect();
      const center = left + width / 2;
      if (positionX >= p && positionX < center) {
        indexDrop = index;
        //console.log('indexDrop >>>', indexDrop);
      }
      p = center;
    });

    setIsVisibleDropZone(
      isVisibleDropZone.map((v: boolean, index) =>
        index === indexDrop ? true : false
      )
    );
  };

  const listDragStartHandler = (
    e: DragEvent<HTMLElement>,
    listIndex: number
  ): void => {
    setDraggedList(lists[listIndex]);
    draggedElement = e.currentTarget;
    setTimeout(() => {
      draggedElement?.classList.add('dragging');
    }, 0);
    //setLists(lists.slice(0, listIndex).concat(lists.slice(listIndex + 1)));
    setDraggedElementSize(draggedElement.getBoundingClientRect());
    const img: HTMLElement = draggedElement;
    if (draggedElementSize) {
      e.dataTransfer.setDragImage(img, draggedElementSize.width / 2, 0);
    }
    // listElements[listIndex].style.width = `${draggedElementSize.width}px`;
    // slotListElement.style.height = `${draggedElementSize.height}px`;

    // listElements[listIndex].style.backgroundColor = 'red';
    // listElements[listIndex].innerHTML = '';
    // console.log('slot >>', slotListElement);
  };

  const listDragEnterHandler = (): void => {};

  const listDragEndHandler = (e: DragEvent<HTMLElement>): void => {
    e.currentTarget.classList.remove('dragging');
    setIsVisibleDropZone(isVisibleDropZone.map(() => false));
  };

  return (
    <div
      className="myBoard"
      onDragOver={(e) => dragOverHandler(e)}
      onDrag={() => {}}
    >
      <Link to={'/'} draggable={false}>
        Home
      </Link>
      <ModalChangeBoard board={board} />
      <div className="lists">
        {lists &&
          lists
            .sort((a: IList, b: IList) => a.position - b.position)
            .map((list: IList, index: number) => {
              return (
                <div className="listContainer" key={list.id}>
                  {isVisibleDropZone[index] && (
                    <Slot
                      className={'list dropZone'}
                      style={{
                        height: `${draggedElementSize?.height}px`,
                        width: `${draggedElementSize?.width}px`,
                      }}
                    />
                  )}
                  <List
                    list={list}
                    listDragStartHandler={listDragStartHandler}
                    listDragEnterHandler={() => listDragEnterHandler()}
                    listDragEndHandler={(e) => listDragEndHandler(e)}
                  />
                </div>
              );
            })}
        <div className="listContainer">
          {isVisibleDropZone[lists.length] && (
            <Slot
              className={'list dropZone'}
              style={{
                height: `${draggedElementSize?.height}px`,
                width: `${draggedElementSize?.width}px`,
              }}
            />
          )}
          <ModalCreateList boardID={boardID} position={lists.length + 1} />
        </div>
      </div>
      <CardEdit />
    </div>
  );
};

export default Board;
