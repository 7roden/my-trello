import React, { useEffect, FC, useState } from 'react';
import Board from './components/Board/Board';
import Modal from './components/Modal/Modal';
import '../styles/home.css';
import { useAppDispatch, useAppSelector } from 'src/hook';
import ProgressBar from './components/Board/ProgressBar';
import Swal from 'sweetalert2';

const Home: FC = () => {
  const { getBoards, clearError } = useAppDispatch();
  useEffect(() => {
    getBoards();
  }, []);

  const [myBoards, setMyBoars] = useState<JSX.Element[]>([]);
  const { boards, loading, error } = useAppSelector((state) => state.boards);
  const rrr = useAppSelector((state) => state);
  console.log('state home >>', rrr);
  useEffect(() => {
    if (boards.length) {
      setMyBoars(
        boards.map((board) => (
          <Board key={board.id} id={board.id} title={board.title} />
        ))
      );
    }
  }, [boards]);

  if (loading) {
    return <ProgressBar />;
  }

  if (error) {
    Swal.fire('ERROR', error, 'error');
    clearError();
  }

  return (
    <div className="home">
      <h1 className="homeTitle">My Boards</h1>
      <div className="myBoards">
        {myBoards}
        <Modal />
      </div>
    </div>
  );
};

export default Home;
