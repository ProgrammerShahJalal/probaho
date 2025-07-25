import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '../../../../../../store';
import { initialState } from '../inital_state';
import axios from 'axios';
import setup from '../../setup';
import { end_point } from '../../../../../../config/api';
import storeSlice from '..';
import { all } from './all';
import { anyObject } from '../../../../../../common_types/object';

type ReturnType = void;
type PayloadType = { [key: string]: any };
type ThunkArgument = {
    dispatch: AppDispatch;
    state: typeof initialState;
};

const api_prefix = setup.api_prefix;
const store_prefix = setup.store_prefix;

const fetch_api = async (param, thunkAPI) => {
    const state = thunkAPI.getState();
    const dispatch = thunkAPI.dispatch;

    dispatch(storeSlice.actions.set_is_loading(true));
    dispatch(storeSlice.actions.set_loading_text('inactiving..'));

    const response = await axios.post(
        `${end_point}/${api_prefix}/inactive`,
        { id: param.id },
    );

    dispatch(storeSlice.actions.set_is_loading(false));
    let row = document.querySelector(`.table_row_${param.id}`);
    if (row) {
        row.classList.add('hide');
    }
    await dispatch(all({}));

    (window as anyObject).toaster('data inactivated.');

    return response.data;
    // thunkAPI.dispatch(storeSlice.actions.my_action())
};

export const inactive = createAsyncThunk<
    ReturnType,
    PayloadType,
    ThunkArgument
>(`${store_prefix}/inactive`, fetch_api);
