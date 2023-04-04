import * as BoardsHomeActionCreators from '../modules/boards/actions'
import * as BoardActionCreators from '../modules/board/actions'
import * as CardActionCreator from '../modules/card/actions'
import * as SlotActionCreator from '../modules/slotDnD/actions'


export default {
    ...BoardsHomeActionCreators,
    ...BoardActionCreators,
    ...CardActionCreator,
    ...SlotActionCreator
}