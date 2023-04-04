import { ICard } from 'ICard';
import { IList } from 'IList';
import {
  CardAction,
  CardActionTypes,
  elementLimitsType,
} from 'src/common/Types/CardTypes';

interface SlotCartState {
  dragedCard: ICard;
  dragedList: IList;
  dragElementLimits: elementLimitsType;
}

const initialState: SlotCartState = {
  dragedCard: {
    id: '',
    title: '',
  },
  dragedList: { id: '', position: 0, title: '', cards: [] },
  dragElementLimits: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
  },
};

export default function reducer(
  state = initialState,
  action: CardAction
): SlotCartState {
  switch (action.type) {
    case CardActionTypes.CARD_DRAG_START:
      return {
        ...state,
        dragedCard: action.payload.card,
        dragedList: action.payload.list,
        dragElementLimits: action.payload.dragElementLimits,
      };
    default: {
      return state;
    }
  }
}
