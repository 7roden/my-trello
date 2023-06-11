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
import { connect } from 'react-redux';
import { IBoardHome } from 'IBoardHome';
import CardEdit from './components/CardEdit/CardEdit';

const Board: FC = () => {
  const { id } = useParams<string>();
  const { getBoard, clearError } = useAppDispatch();
  const { board, loading, error } = useAppSelector((state) => state.board);
  const { card, isVisibleEditCard } = useAppSelector((state) => state.card);
  let [lists, setLists] = useState<IList[]>([]);

  useEffect(() => {
    if (id) getBoard(id);
  }, [id]);

  useEffect(() => {
    if (board?.title) {
      setLists(board.lists);
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
      <Link to={'/'} draggable={false}>
        Home
      </Link>
      <ModalChangeBoard board={board} />
      <div className="lists">
        {lists &&
          lists.map((list: IList) => {
            return <List key={list.id} list={list} />;
          })}
        <ModalCreateList boardID={id} position={lists.length + 1} />
      </div>
      {isVisibleEditCard && <CardEdit card={card} />}
    </div>
  );
};

export default Board;
