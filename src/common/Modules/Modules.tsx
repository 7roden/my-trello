import { IBoard } from 'IBoard ';
import Swal from 'sweetalert2';
import api from 'src/api';
import { ICard } from 'ICard';
import { IList } from 'IList';
import { EditCardsType } from '../Types/CardTypes';
import { useAppDispatch } from 'src/hook';
import { CardAdd } from '../interfaces/CardAdd';
import { createCard, deleteCard, editCards } from 'src/store/modules/board/actions';


export function isValidTitle(title: string): boolean {
  const invalidСhar = title.replace(/[a-zа-яё0-9\n_.\-\s]/gi, '');
  if (title.trim().length && !invalidСhar.length) return true;

  if (!title.trim()) Swal.fire('ERROR', 'You did not enter a name', 'warning');

  if (invalidСhar.length)
    Swal.fire(
      'ERROR',
      'There is impossible characters in the name: '.concat(invalidСhar),
      'warning'
    );

  return false;
}

export async function getDataBoard(id: string) {
  const data: IBoard = await api.get(`/board/${id}`);
  data.id = id;

  return data;
}

export function movingCardOnSheet(
  drawnCardPosition: number,
  card: ICard | null,
  list: IList | null,
  boardID: string
) {
  if (card) list?.cards.splice(drawnCardPosition, 0, card);
  const editCardLists: EditCardsType = list?.cards.map(
    (c: ICard, index: number) => {
      return {
        id: c.id,
        position: index + 1,
        list_id: list?.id || '',
      };
    }
  );
  editCards(boardID, editCardLists);
}

export function movingCardOnBoard(
  list: IList | null,
  selectedList: IList | null,
  boardID: string
) {
  const editCardLists: EditCardsType = list?.cards
    .map((c: ICard, index: number) => {
      return {
        id: c.id,
        position: index + 1,
        list_id: list?.id || '',
      };
    })
    .concat(
      selectedList?.cards.map((c: ICard, index: number) => {
        return {
          id: c.id,
          position: index + 1,
          list_id: selectedList?.id || '',
        };
      })
    );
  editCards(boardID, editCardLists);
}

export async function movingCardToAnotherBoard(
  card: ICard | null,
  selectedList: IList | null,
  selectedCardPosition: number,
  selectedBoardID: string,
  list: IList | null,
  boardID: string
) {
  const newCard: CardAdd = {
    title: card?.title || '',
    list_id: selectedList?.id,
    position: selectedCardPosition,
    description: card?.title || '',
    custom: {},
  };
  await createCard(newCard, selectedBoardID);
  let editCardLists: EditCardsType = selectedList?.cards
    .filter((c: ICard) => c.id !== card?.id)
    .map((c: ICard, index: number) => {
      let position = index++;
      if (selectedCardPosition && position >= selectedCardPosition)
        position = position++;
      return {
        id: c.id,
        position,
        list_id: selectedList?.id || '',
      };
    });
  await editCards(selectedBoardID, editCardLists);
  editCardLists = list?.cards.map((c: ICard, index: number) => {
    return {
      id: c.id,
      position: index + 1,
      list_id: list?.id || '',
    };
  });
  console.log('editcardsList boardID>>', editCardLists);
  await deleteCard(boardID, card?.id);
}

const changeBoard = (boardID: string, currentBoardID: string) => {
  // if (boardID === currentBoardID) {
  //   setSelectedBoard(currentBoard);
  //   if (list) setSelectedList(list);
  //   if (card) setSelectedCardPosition(card.position);
  // } else {
  //   getDataBoard(board_id).then(
  //     (b) => {
  //       setSelectedBoard(b);
  //     },
  //     (e) => {
  //       alert(e); // оповіщення у разі помилки при отриманні данних з бекенду
  //     }
  //   );
  // }
};
