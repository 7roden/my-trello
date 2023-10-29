export interface ICard {
  id: string;
  title: string;
  position: number;
  description?: string;
  color?: string;
  custom?: any;
  users?: ID[];
  created_at?: timestamp;
}
