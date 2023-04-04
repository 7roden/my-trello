import { AxiosError } from 'axios';
import { Dispatch } from 'redux';
import api from 'src/api';
import { IBoardHome } from 'src/common/interfaces/IBoardHome';
import {
  BoardHomeActionTypes,
  BoardsHomeAction,
  TIME_OUT_PAUSE,
} from 'src/common/Types/BoardTypes';

export const getBoards = () => async (dispatch: Dispatch<BoardsHomeAction>) => {
  try {
    dispatch({ type: BoardHomeActionTypes.FETCH_BOARDS });
    const data: { boards: IBoardHome[] } = await api.get('/board');
    //console.log('boards data >', data);
    await setTimeout(
      () =>
        dispatch({
          type: BoardHomeActionTypes.UPDATE_BOARDS,
          payload: data.boards,
        }),
      TIME_OUT_PAUSE
    );
  } catch (e) {
    const error = e as AxiosError;
    //console.log('cath >', error.message);
    dispatch({
      type: BoardHomeActionTypes.ERROR_ACTION_TYPE,
      payload: error.message,
    });
  }
};

export const createBoard =
  (newBoard: IBoardHome) => async (dispatch: Dispatch<BoardsHomeAction>) => {
    try {
      dispatch({ type: BoardHomeActionTypes.FETCH_BOARDS });
      await api.post(`/board`, {
        title: newBoard.title,
        custom: newBoard.custom,
      });
      const data: { boards: [] } = await api.get('/board');
      await setTimeout(
        () =>
          dispatch({
            type: BoardHomeActionTypes.CREATE_BOARD,
            payload: data.boards,
          }),
        TIME_OUT_PAUSE
      );
    } catch (e) {
      const error = e as AxiosError;
      //console.log('cath >', error.message);
      dispatch({
        type: BoardHomeActionTypes.ERROR_ACTION_TYPE,
        payload: error.message,
      });
    }
  };

export const deleteBoard =
  (id: string | undefined) => async (dispatch: Dispatch<BoardsHomeAction>) => {
    try {
      dispatch({ type: BoardHomeActionTypes.FETCH_BOARDS });
      await api.delete(`/board/${id}`);
      const data: { boards: [] } = await api.get('/board');
      await setTimeout(
        () =>
      dispatch({
        type: BoardHomeActionTypes.DELETE_BOARD,
        payload: data.boards,
      }),
      TIME_OUT_PAUSE
    );
    } catch (e) {
      const error = e as AxiosError;
      //console.log('cath >', error.message);
      dispatch({
        type: BoardHomeActionTypes.ERROR_ACTION_TYPE,
        payload: error.message,
      });
    }
  };

export const clearError = () => (dispatch: Dispatch<BoardsHomeAction>) => {
  dispatch({ type: BoardHomeActionTypes.CLEAR_ERROR });
};
/*

import { Dispatch } from 'redux';
import axios from 'axios'
import api from 'src/api';
import config from 'src/common/constants/api';

const baseUrl = 'https://trello-back.shpp.me/rdenysenko/api/v1/board'

export const getBoards = () => async (dispatch: Dispatch): Promise<void> => {
  try {
    const response = await axios.get(baseUrl);
    console.log('data >',response.data)
    //await dispatch({ type: 'UPDATE_BOARDS', payload: data});
  } catch (e) {
    console.log('cath >',e)
    dispatch({ type: 'ERROR_ACTION_TYPE' });
  }
};


interface BoardsServerResponse {
  boards: []
}

const boardsInGet: BoardsServerResponse  = await instance.get("/board");

export const getBoards = () => async (dispatch: Dispatch) => {
  try {
      const { boards } = await api.get("/board");
      await dispatch({type: 'UPDATE_BOARDS', payload: boards});
  } catch (e) {
      console.log(e)
      dispatch({type: 'ERROR_ACTION_TYPE'});
  }
}

*/
