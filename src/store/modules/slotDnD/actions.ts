import { ICard } from 'ICard';
import { IList } from 'IList';
import { Dispatch } from 'react';
import {
  CardAction,
  CardActionTypes,
  elementLimitsType,
} from 'src/common/Types/CardTypes';

export const cardDragStart =
  (card: ICard, list: IList, dragElementLimits: elementLimitsType) =>
  (dispatch: Dispatch<CardAction>) => {
    dispatch({
      type: CardActionTypes.CARD_DRAG_START,
      payload: { card, list, dragElementLimits },
    });
  };

export const cardDragEnd = () => (dispatch: Dispatch<CardAction>) => {
  dispatch({
    type: CardActionTypes.CARD_DRAG_END,
  });
};
