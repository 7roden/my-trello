import { combineReducers } from 'redux';
import boardReducer from './modules/board/reducer';
import boardsReducer from './modules/boards/reducer';
import userReducer from './modules/user/reducer';
import cardReducer from './modules/card/reducer';
import slotDnDReduser from './modules/slotDnD/reducer'

export default combineReducers({
    board: boardReducer,
    boards: boardsReducer,
    card: cardReducer,
    slotDnD: slotDnDReduser,
    user: userReducer
});
