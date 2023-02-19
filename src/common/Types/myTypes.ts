import { IBoardHome } from 'IBoardHome';
import { IBoard } from 'IBoard ';

export type StateType = {
  board: { board: IBoard };
  boards: { boards: IBoardHome[] };
  user: {};
};

export enum BoardHomeActionTypes {
  FETCH_BOARDS = 'FETCH_BOARDS',
  UPDATE_BOARDS = 'UPDATE_BOARDS',
  ERROR_ACTION_TYPE = 'ERROR_ACTION_TYPE',
  CREATE_BOARD = 'CREATE_BOARD',
  DELETE_BOARD = 'DELETE_BOARD',
  CLEAR_ERROR = 'CLEAR_ERROR',
}

export enum BoardActionTypes {
  FETCH_BOARD = 'FETCH_BOARD',
  UPDATE_BOARD = 'UPDATE_BOARD',
  CHANGE_BOARD = 'CHANGE_BOARD',
  CREATE_LIST = 'CREATE_LIST',
  CHANGE_LIST_TITLE = 'CHANGE_LIST_TITLE',
  DELETE_CARD = 'DELETE_CARD',
  CREATE_CARD = 'CREATE_CARD',
  DELETE_LIST = 'DELETE_LIST',
  ERROR_ACTION_TYPE = 'ERROR_ACTION_TYPE',
  CLEAR_ERROR = 'CLEAR_ERROR',
}
export const TIME_OUT_PAUSE = 2000;

interface FetchBoards {
  type: BoardHomeActionTypes.FETCH_BOARDS;
}
interface FetchUpdateBoards {
  type: BoardHomeActionTypes.UPDATE_BOARDS;
  payload: IBoardHome[];
}
interface FetchCreateBoard {
  type: BoardHomeActionTypes.CREATE_BOARD;
  payload: IBoardHome[];
}

interface FetchErrorBoards {
  type: BoardHomeActionTypes.ERROR_ACTION_TYPE;
  payload: string;
}

interface FethBoardHomeClearError {
  type: BoardHomeActionTypes.CLEAR_ERROR;
}

interface FethDeleteBoardHome {
  type: BoardHomeActionTypes.DELETE_BOARD;
  payload: IBoardHome[];
}

export type BoardsHomeAction =
  | FetchBoards
  | FetchUpdateBoards
  | FetchErrorBoards
  | FetchCreateBoard
  | FethBoardHomeClearError
  | FethDeleteBoardHome;

interface FetchBoard {
  type: BoardActionTypes.FETCH_BOARD;
}

interface FetchUpdateBoard {
  type: BoardActionTypes.UPDATE_BOARD;
  payload: IBoard;
}
interface FetchChangeBoard {
  type: BoardActionTypes.CHANGE_BOARD;
  payload: IBoard;
}

interface FetchCreateList {
  type: BoardActionTypes.CREATE_LIST;
  payload: IBoard;
}

interface FetchChangeList {
  type: BoardActionTypes.CHANGE_LIST_TITLE;
  payload: IBoard;
}

interface FetchCreateCard {
  type: BoardActionTypes.CREATE_CARD;
  payload: IBoard;
}

interface FetchErrorAction {
  type: BoardActionTypes.ERROR_ACTION_TYPE;
  payload: string;
}

interface FethDeleteList {
  type: BoardActionTypes.DELETE_LIST;
  payload: IBoard;
}

interface FethDeleteCard {
  type: BoardActionTypes.DELETE_CARD;
  payload: IBoard;
}

interface FethBoardClearError {
  type: BoardActionTypes.CLEAR_ERROR;
}

export type BoardAction =
  | FetchBoard
  | FetchUpdateBoard
  | FetchChangeBoard
  | FetchCreateList
  | FetchChangeList
  | FetchCreateCard
  | FetchErrorAction
  | FethDeleteList
  | FethDeleteCard
  | FethBoardClearError;
