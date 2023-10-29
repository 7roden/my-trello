import { FC } from 'react';
import { IStyle } from 'IStyle';

type propsCardEditType = {
  style: IStyle;
  className: string;
};

const Slot: FC<propsCardEditType> = ({ style, className }) => {
  return (
    <div
      className={className}
      onDragOver={(e) => e.preventDefault()}
      style={{ height: style.height, width: style.width }}
    ></div>
  );
};

export default Slot;
