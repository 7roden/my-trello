import * as BoardsHomeActionCreators from '../modules/boards/actions'
import * as BoardActionCreators from '../modules/board/actions'

export default {
    ...BoardsHomeActionCreators,
    ...BoardActionCreators
}