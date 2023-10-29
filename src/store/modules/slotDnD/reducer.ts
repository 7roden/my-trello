import { ICard } from 'ICard';
import { IList } from 'IList';
import {
  CardAction,
  CardActionTypes,
  elementLimitsType,
} from 'src/common/Types/CardTypes';

interface SlotCartState {
  dragedCard: ICard | null;
  dragedList: IList | null;
  dragElementLimits: elementLimitsType | null;
}

const initialState: SlotCartState = {
  dragedCard: null,
  dragedList: null,
  dragElementLimits: null,
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
      case CardActionTypes.CARD_DRAG_END:
        return {
          ...state,
          dragedCard: null,
          dragedList: null,
          dragElementLimits: null,
        };
    default: {
      return state;
    }
  }
}
