import {
  SET_HEADER_INFO,
  SET_BOOK,
  BOOK_UPDATE,
  BOOK_USERCOLOR,
  BOOK_USERFONT,
  ADD_BOOK
} from './mutationsType'
import { setStore } from './const'
export default {
  [SET_HEADER_INFO](state, header) {
    state.header.headtype = header.headtype
    state.header.headtitle = header.headtitle
  },
  [SET_BOOK](state, book) {
    state.calbook = book
    setStore('SHEFLBOOK', state.calbook) // 存储local
  },
  [BOOK_UPDATE](state,books){
    state.shuajiabook = books
    setStore('BOOK_UPDATE', books) //setStore  window.localStorage.setItem(name, content)
  }
}
