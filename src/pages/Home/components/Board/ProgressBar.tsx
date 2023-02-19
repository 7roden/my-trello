import { IStyle } from 'IStyle';
import { useEffect, useState } from 'react';

export default function ProgressBar() {
  const [value, setValue] = useState(0);
  const progressBarSize = {
    width: 200,
    height: 200
  }
  const windowSize = {
    width: window.screen.width,
    height: window.screen.height
  }
  const positionProgressBar = {
    top: (windowSize.height-progressBarSize.height)/2,
    left: (windowSize.width-progressBarSize.width)/2

  }
  const styleProgressBar: IStyle = {
    position: 'absolute',
    width: `${progressBarSize.width}px`,
    height: `${progressBarSize.height}px`,
    margin: `${positionProgressBar.top}px ${positionProgressBar.left}px`,
  }
  useEffect(() => {
    const interval = setInterval(() => {
      if (value >= 100) setValue(0);
      setValue((value) => value + 10);
    }, 50);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <div className='ProgressBar' style={styleProgressBar}>
      <label>Loading...</label>
      <progress max="100" value={value}>
        {value}
      </progress>
    </div>
  );
}
