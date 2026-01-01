import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  list: [
    {
    id: null,
    famille_id: null,
    categoryid: null,
    nomFrancais:null,
    nomAnglais:null,
    seoTitle:null,
    seoDescription:null,
    seoKeywords:null,

} ],
selectedSubCategory: null,
isLoading: false,
};

const subCategory = createSlice({
  name: 'subCategory',
  initialState,
  reducers: {
    setSubCategory: (state, action) => {
     state.list = action.payload;
       
    },
    selectedSubCategory: (state, action) => {
      state.selectedSubCategory = action.payload;
    },
    clearTypes: (state) => {
      state.list = [];
    },
        setLoadingType: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});

export const { setSubCategory ,clearTypes,setLoadingType, selectedSubCategory} = subCategory.actions;
export default subCategory.reducer;