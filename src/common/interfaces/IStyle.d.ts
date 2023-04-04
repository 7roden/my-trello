type colorType = 'red' | 'blue' | 'grey' | 'white' | 'yellow';

export interface IStyle {
  display?: 'block' | 'inline' | 'none';
  position?: 'absolute';
  margin?: string;
  width?: string;
  height?: string;
  backgroundColor?: string;
  opacity?: string;
  position?: 'relative' | 'absolute' | 'fixed' | 'static';
  top?: string;
  left?: string;
  right?: string;
  zIndex?: string;
  color?: colorType;
  backgroundColor?: colorType;
}
