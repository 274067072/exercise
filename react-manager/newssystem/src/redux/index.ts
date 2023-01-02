import { configureStore } from "@reduxjs/toolkit";
import sideMenuListReducer from "./reducers/sideMenuListReducer";
import roleListReducer from "./reducers/roleListReducer";
import userListReducer from "./reducers/userListReducer";
import newsCategoriesReducer from "./reducers/newsCategoriesReducer";
import newsListReducer from "./reducers/newsListReducer";
import isLoadingReducer from "./reducers/isLoadingReducer";
import homeReducer from "./reducers/homeReducer";

const store = configureStore({
  reducer: {
    sideMenuListReducer,
    roleListReducer,
    userListReducer,
    newsCategoriesReducer,
    newsListReducer,
    isLoadingReducer,
    homeReducer,
  },
});

// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>;
// 推断出类型: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
