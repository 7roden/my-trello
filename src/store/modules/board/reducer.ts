import { IBoard } from 'IBoard ';
import { BoardAction, BoardActionTypes } from 'src/common/Types/myTypes';

interface boardState {
  board: IBoard;
  loading: boolean;
  error: string;
}

const initialState: boardState = {
  board: {
    id: '',
    title: '',
    lists: [],
  },
  loading: true,
  error: '',
};

export default function reducer(
  state = initialState,
  action: BoardAction
): boardState {
  //console.log('board reduser action >>',action);
  console.log('board reduser state >>', state);
  switch (action.type) {
    case BoardActionTypes.FETCH_BOARD:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case BoardActionTypes.UPDATE_BOARD:
      return {
        ...state,
        board: action.payload,
        loading: false,
        error: '',
      };
    case BoardActionTypes.CHANGE_BOARD:
      return {
        ...state,
        board: action.payload,
        loading: false,
        error: '',
      };
    case BoardActionTypes.CREATE_LIST:
      return {
        ...state,
        board: action.payload,
        loading: false,
        error: '',
      };
    case BoardActionTypes.CHANGE_LIST_TITLE:
      return {
        ...state,
        board: action.payload,
        loading: false,
        error: '',
      };
    case BoardActionTypes.CREATE_CARD:
      return {
        ...state,
        board: action.payload,
        loading: false,
        error: '',
      };
    case BoardActionTypes.ERROR_ACTION_TYPE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case BoardActionTypes.CLEAR_ERROR:
      return {
        ...state,
        loading: false,
        error: '',
      };
    case BoardActionTypes.DELETE_LIST:
      return {
        ...state,
        board: action.payload,
        loading: false,
        error: '',
      };
    case BoardActionTypes.DELETE_CARD:
      return {
        ...state,
        board: action.payload,
        loading: false,
        error: '',
      };
    default: {
      return state;
    }
  }
}
