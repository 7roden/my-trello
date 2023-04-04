import { Dispatch } from 'redux';
import api from 'src/api';
import config from 'src/common/constants/api';
import { IBoard } from 'IBoard ';
import { IBoardHome } from 'src/common/interfaces/IBoardHome';
import { ListAdd } from 'src/common/interfaces/ListAdd';
import { CardAdd } from 'src/common/interfaces/CardAdd';
import {
  BoardAction,
  BoardActionTypes,
  TIME_OUT_PAUSE,
} from 'src/common/Types/BoardTypes';
import { AxiosError } from 'axios';
import { EditListsType } from 'src/common/Types/ListTypes';
import { EditCardsType } from 'src/common/Types/CardTypes';

type typeBoardDispatch = {
  type: string;
  payload?: IBoard;
};

async function getDataBoard(boardID: string) {
  const data: IBoard = await api.get(`/board/${boardID}`);
  return data;
}

export const getBoard =
  (id: string) => async (dispatch: Dispatch<BoardAction>) => {
    try {
      dispatch({ type: BoardActionTypes.FETCH_BOARD });
      const data: IBoard = await api.get(`/board/${id}`);
      await setTimeout(
        () => dispatch({ type: BoardActionTypes.UPDATE_BOARD, payload: data }),
        TIME_OUT_PAUSE
      );
    } catch (e) {
      const error = e as AxiosError;
      //console.log('cath >', error.message);
      dispatch({
        type: BoardActionTypes.ERROR_ACTION_TYPE,
        payload: error.message,
      });
    }
  };

export const changeBoard =
  (board: IBoardHome) => async (dispatch: Dispatch<BoardAction>) => {
    const { id, title, custom } = board;
    try {
      dispatch({ type: BoardActionTypes.FETCH_BOARD });
      await api.put(`/board/${id}`, {
        title,
      });
      const data: IBoard = await api.get(`/board/${id}`);
      await dispatch({ type: BoardActionTypes.CHANGE_BOARD, payload: data });
    } catch (e) {
      const error = e as AxiosError;
      //console.log('cath >', error.message);
      dispatch({
        type: BoardActionTypes.ERROR_ACTION_TYPE,
        payload: error.message,
      });
    }
  };

export const createList =
  (list: ListAdd) => async (dispatch: Dispatch<BoardAction>) => {
    const { boardID, title, position } = list;
    try {
      dispatch({ type: BoardActionTypes.FETCH_BOARD });
      await api.post(`/board/${boardID}/list`, {
        title,
        position,
      });
      const data: IBoard = await api.get(`/board/${boardID}`);
      await setTimeout(
        () => dispatch({ type: BoardActionTypes.CREATE_LIST, payload: data }),
        TIME_OUT_PAUSE
      );
    } catch (e) {
      const error = e as AxiosError;
      //console.log('cath >', error.message);
      dispatch({
        type: BoardActionTypes.ERROR_ACTION_TYPE,
        payload: error.message,
      });
    }
  };

export const changeListTitle =
  (list: ListAdd) => async (dispatch: Dispatch<BoardAction>) => {
    const { listID, boardID, title, position } = list;
    try {
      dispatch({ type: BoardActionTypes.FETCH_BOARD });
      await api.put(`/board/${boardID}/list/${listID}`, {
        title,
      });
      const data: IBoard = await api.get(`/board/${boardID}`);
      await setTimeout(
        () =>
          dispatch({
            type: BoardActionTypes.CHANGE_LIST_TITLE,
            payload: data,
          }),
        TIME_OUT_PAUSE
      );
    } catch (e) {
      const error = e as AxiosError;
      //console.log('cath >', error.message);
      dispatch({
        type: BoardActionTypes.ERROR_ACTION_TYPE,
        payload: error.message,
      });
    }
  };

export const createCard =
  (card: CardAdd, boardID: string | undefined) =>
  async (dispatch: Dispatch<BoardAction>) => {
    const { title, list_id, position, description, custom } = card;
    try {
      dispatch({ type: BoardActionTypes.FETCH_BOARD });
      await api.post(`/board/${boardID}/card`, {
        title,
        list_id,
        position,
        description,
        custom,
      });
      const data: IBoard = await api.get(`/board/${boardID}`);
      console.log(data);
      await setTimeout(
        () => dispatch({ type: BoardActionTypes.CREATE_CARD, payload: data }),
        TIME_OUT_PAUSE
      );
    } catch (e) {
      const error = e as AxiosError;
      //console.log('cath >', error.message);
      dispatch({
        type: BoardActionTypes.ERROR_ACTION_TYPE,
        payload: error.message,
      });
    }
  };

export const deleteList =
  (boardID: string | undefined, listID: string | undefined) =>
  async (dispatch: Dispatch<BoardAction>) => {
    try {
      await api.delete(`/board/${boardID}/list/${listID}`);
      dispatch({ type: BoardActionTypes.DELETE_LIST });
    } catch (e) {
      const error = e as AxiosError;
      //console.log('cath >', error.message);
      dispatch({
        type: BoardActionTypes.ERROR_ACTION_TYPE,
        payload: error.message,
      });
    }
  };

export const editLists =
  (boardID: string | undefined, lists: EditListsType) =>
  async (dispatch: Dispatch<BoardAction>) => {
    try {
      await api.put(`/board/${boardID}/list`, lists);
      const data: IBoard = await api.get(`/board/${boardID}`);
      await dispatch({ type: BoardActionTypes.EDIT_LISTS, payload: data });
    } catch (e) {
      const error = e as AxiosError;
      //console.log('cath >', error.message);
      dispatch({
        type: BoardActionTypes.ERROR_ACTION_TYPE,
        payload: error.message,
      });
    }
  };

export const deleteCard =
  (boardID: string | undefined, cardID: string | undefined) =>
  async (dispatch: Dispatch<BoardAction>) => {
    try {
      await api.delete(`/board/${boardID}/card/${cardID}`);
      dispatch({ type: BoardActionTypes.DELETE_CARD});
    } catch (e) {
      const error = e as AxiosError;
      //console.log('cath >', error.message);
      dispatch({
        type: BoardActionTypes.ERROR_ACTION_TYPE,
        payload: error.message,
      });
    }
  };

export const editCards =
  (boardID: string | undefined, cards: EditCardsType) =>
  async (dispatch: Dispatch<BoardAction>) => {
    try {
      //console.log('cards >> ',cards);
      await api.put(`/board/${boardID}/card`, cards);
      const data: IBoard = await api.get(`/board/${boardID}`);
      //console.log('data >> ',data);
      await dispatch({ type: BoardActionTypes.EDIT_CARDS, payload: data });
    } catch (e) {
      const error = e as AxiosError;
      dispatch({
        type: BoardActionTypes.ERROR_ACTION_TYPE,
        payload: error.message,
      });
    }
  };

export const clearError = () => (dispatch: Dispatch<BoardAction>) => {
  dispatch({ type: BoardActionTypes.CLEAR_ERROR });
};
