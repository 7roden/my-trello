import { ICard } from 'ICard';
import { IList } from 'IList';

export type EditCardsType = { id: string; position: number; list_id: string }[];

export enum CardActionTypes {
  SHOW_MODAL_CARD = 'SHOW_MODAL_CARD',
  HIDEN_MODAL_CARD = 'HIDEN_MODAL_CARD',
  CARD_DRAG_START = 'CARD_DRAG_START',
}

interface FetchShowModalCard {
  type: CardActionTypes.SHOW_MODAL_CARD;
  payload: ICard;
}

interface FetchHidenModalCard {
  type: CardActionTypes.HIDEN_MODAL_CARD;
}

interface FetchCardDragStart {
  type: CardActionTypes.CARD_DRAG_START;
  payload: { card: ICard; list: IList; dragElementLimits: elementLimitsType };
}

export type CardAction =
  | FetchShowModalCard
  | FetchHidenModalCard
  | FetchCardDragStart;

export type elementLimitsType = {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
};
