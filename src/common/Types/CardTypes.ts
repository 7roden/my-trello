import { ICard } from 'ICard';
import { IList } from 'IList';

export type EditCardsType = { id: string; position: number; list_id: string }[];

export enum CardActionTypes {
  SHOW_MODAL_CARD = 'SHOW_MODAL_CARD',
  HIDEN_MODAL_CARD = 'HIDEN_MODAL_CARD',
  CARD_DRAG_START = 'CARD_DRAG_START',
  CARD_DRAG_END = 'CARD_DRAG_END',
}

export enum ModalCardActionsTypes {
  CARD_MOVEMENT = 'CARD_MOVEMENT',
  CARD_COPYING = 'CARD_COPYING',
}


interface FetchShowModalCard {
  type: CardActionTypes.SHOW_MODAL_CARD;
  payload: {card: ICard; list: IList};
}

interface FetchHidenModalCard {
  type: CardActionTypes.HIDEN_MODAL_CARD;
}

interface FetchCardDragStart {
  type: CardActionTypes.CARD_DRAG_START;
  payload: { card: ICard; list: IList; dragElementLimits: elementLimitsType };
}

interface FetchCardDragEnd {
  type: CardActionTypes.CARD_DRAG_END
}


export type CardAction =
  | FetchShowModalCard
  | FetchHidenModalCard
  | FetchCardDragStart
  | FetchCardDragEnd;

export type elementLimitsType = {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
};
