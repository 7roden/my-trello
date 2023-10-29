
import { ICard } from 'ICard';
import { IList } from 'IList';
import { Dispatch } from 'redux';
import { CardAction, CardActionTypes } from 'src/common/Types/CardTypes';

export const showModalCard =
  (card: ICard, list:IList) => (dispatch: Dispatch<CardAction>) => {
    dispatch({
      type: CardActionTypes.SHOW_MODAL_CARD,
      payload: {card, list},
    });
  };

export const hidenModalCard = () => (dispatch: Dispatch<CardAction>) => {
  dispatch({ type: CardActionTypes.HIDEN_MODAL_CARD });
};
