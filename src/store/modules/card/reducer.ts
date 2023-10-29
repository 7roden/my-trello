import { ICard } from 'ICard';
import { IList } from 'IList';
import { CardAction, CardActionTypes } from 'src/common/Types/CardTypes';

interface CardState {
  card: ICard | null;
  list: IList | null;
  isVisibleEditCard: boolean;
}

const initialState: CardState = {
  card: null,
  list: null,
  isVisibleEditCard: false,
};

export default function reducer(
  state = initialState,
  action: CardAction
): CardState {
  switch (action.type) {
    case CardActionTypes.SHOW_MODAL_CARD:
      return {
        ...state,
        card: action.payload.card,
        list: action.payload.list,
        isVisibleEditCard: true,
      };
    case CardActionTypes.HIDEN_MODAL_CARD:
      return {
        ...state,
        isVisibleEditCard: false,
        card: { title: '', id: '', position: 0 },
      };
    default: {
      return state;
    }
  }
}
