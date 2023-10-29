import React, { useEffect, FC, useState } from 'react';
import Board from './components/Board/Board';
import Modal from './components/Modal/Modal';
import './home.scss';
import { useAppDispatch, useAppSelector } from 'src/hook';
import ProgressBar from './components/Board/ProgressBar';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const Home: FC = () => {
  const { getBoards, clearError } = useAppDispatch();
  useEffect(() => {
    getBoards();
  }, []);

  const [myBoards, setMyBoars] = useState<JSX.Element[]>([]);
  const { boards, loading, error } = useAppSelector((state) => state.boards);
  useEffect(() => {
    if (boards.length) {
      setMyBoars(
        boards.map((board) => (
          <Link key={board.id} to={`/board/${board.id}`} draggable='false'>
            <Board id={board.id} title={board.title} />
          </Link>
        ))
      );
    }
  }, [boards]);

  if (error) {
    Swal.fire('ERROR', error, 'error');
    clearError();
  }

  return (
    <div className="home">
      <h1 className="homeTitle">My Boards</h1>
      {loading ? (
        <ProgressBar />
      ) : (
        <div className="myBoards">
          {myBoards}
          <Modal />
        </div>
      )}
    </div>
  );
};

export default Home;
