
import { configureStore } from '@reduxjs/toolkit';
import beltReducer from './beltSlice';
import familyReducer from './familySlice';
import typeReducer from './typeSlice';
import subCategoryReducer from './subCategorySlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // localStorage
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
belt: beltReducer,
family: familyReducer,
type: typeReducer,
subCategory: subCategoryReducer,
  

});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['belt', 'family', 'type', 'subCategory'], 
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});
export const persistor = persistStore(store);

export default store;
