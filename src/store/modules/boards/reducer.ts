import { IBoardHome } from 'IBoardHome'; // не забудьте описать этот интерфейс :)
import {
  BoardHomeActionTypes,
  BoardsHomeAction,
} from 'src/common/Types/BoardTypes';

interface boardsState {
  boards: IBoardHome[];
  loading: boolean;
  error: string;
}

const initialState: boardsState = {
  boards: [],
  loading: true,
  error: '',
};

export default function reducer(
  state = initialState,
  action: BoardsHomeAction
): boardsState {
  switch (action.type) {
    case BoardHomeActionTypes.FETCH_BOARDS: {
      return { loading: true, boards: [], error: '' };
    }
    case BoardHomeActionTypes.UPDATE_BOARDS:
      return {
        ...state,
        error: '',
        loading: false,
        boards: action.payload,
      };
    case BoardHomeActionTypes.CREATE_BOARD:
      return {
        ...state,
        error: '',
        loading: false,
        boards: action.payload,
      };
    case BoardHomeActionTypes.ERROR_ACTION_TYPE:
      return {
        ...state,
        boards: [],
        error: action.payload,
        loading: false,
      };
    case BoardHomeActionTypes.CLEAR_ERROR:
      return {
        ...state,
        loading: false,
        error: '',
      };
    case BoardHomeActionTypes.DELETE_BOARD:
      return {
        ...state,
        boards: action.payload,
        loading: false,
        error: '',
      };
    default: {
      return state;
    }
  }
}
