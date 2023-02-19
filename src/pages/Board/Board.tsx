import React, { useState, useEffect, FC } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../styles/board.css';
import List from './components/List/List';
import ModalCreateList from './components/List/ModalList/ModalCreateList';
import { IList } from 'IList';
import { IBoard } from 'IBoard ';
import ModalChangeBoard from 'src/pages/Board/components/ModalChangeBoard';
import { useAppDispatch, useAppSelector } from 'src/hook';
import ProgressBar from '../Home/components/Board/ProgressBar';
import Swal from 'sweetalert2';
import { FaPencilAlt } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';

type propsType = {
  board: IBoard;
  getBoard: () => Promise<void>;
};

const Board: FC = () => {
  const { id } = useParams<string>();
  const { getBoard, clearError } = useAppDispatch();
  let { board, loading, error } = useAppSelector((state) => state.board);
  let [title, setTitle] = useState<string>('');
  let [lists, setLists] = useState<JSX.Element[]>([]);
  useEffect(() => {
    getBoard(id || '');
  }, []);

  useEffect(() => {
    if (board?.title) {
      setTitle(board.title);
      setLists(
        board.lists.map((list: IList) => {
          return (
            <List
              key={list.id}
              id={`${list.id}`}
              title={list.title}
              cards={list.cards}
            />
          );
        })
      );
    }
  }, [board]);


  if (loading) {
    return <ProgressBar />;
  }

  if (error) {
    Swal.fire('ERROR', error, 'error');
    clearError();
  }

  return (
    <div className="myBoard">
      <Link to={'/'}>Home</Link>
      <ModalChangeBoard board={board} />
      <div className="lists">
        {lists}
        <ModalCreateList boardID={id} position={lists.length + 1} />

      </div>
    </div>
  );
};

export default Board;
