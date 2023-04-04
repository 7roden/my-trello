
import { ICard } from 'ICard';
import { Dispatch } from 'redux';
import { CardAction, CardActionTypes } from 'src/common/Types/CardTypes';

export const showModalCard =
  (card: ICard) => (dispatch: Dispatch<CardAction>) => {
    dispatch({
      type: CardActionTypes.SHOW_MODAL_CARD,
      payload: card,
    });
  };

export const hidenModalCard = () => (dispatch: Dispatch<CardAction>) => {
  dispatch({ type: CardActionTypes.HIDEN_MODAL_CARD });
};
