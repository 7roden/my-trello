export interface IBoard {
  id: string;
  title: string;
  lists: IList[];
  custom?: any;
  users?: [{ id: 1; username: 'dff' }];
}
