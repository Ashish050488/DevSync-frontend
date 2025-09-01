import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../utils/userSlice'
import feedReducer from "../utils/feedSlice";
import connectionReducer from '../utils/connectionSlice'

const appStore = configureStore({
reducer:{
    user:userReducer,
    feed:feedReducer,
    connection: connectionReducer,
}
});


export default appStore