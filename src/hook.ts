import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RootState, AppDispatch } from './store/store';
import ActionCreators from 'src/store/actionCreators';

export const useAppDispatch = () => {
  const dispatch = useDispatch();
  return bindActionCreators(ActionCreators, dispatch);
};
//useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
