import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch } from '../../../../../../store';
import { initialState } from '../inital_state';
import setup from '../../setup';
import { end_point } from '../../../../../../config/api';
import storeSlice from '..';
import fetchDataAndUpdateCache from '../../../../../../config/http';
import { anyObject } from '../../../../../../common_types/object';
import commonStore from '../../../../../../store/slices/common_slice';

type ReturnType = void;
type PayloadType = { [key: string]: any };
type ThunkArgument = {
    dispatch: AppDispatch;
    state: typeof initialState;
    extra?: unknown;
    rejectValue?: unknown;
    serializedErrorType?: unknown;
    pendingMeta?: unknown;
    fulfilledMeta?: unknown;
    rejectedMeta?: unknown;
};

const store_prefix = setup.store_prefix;
const api_host = setup.api_host;
const api_prefix = setup.api_prefix;

const fetch_api = async (param, thunkAPI) => {
    const state: typeof initialState = thunkAPI.getState()[setup.module_name];
    const dispatch = thunkAPI.dispatch;

    dispatch(storeSlice.actions.set_is_loading(true));
    dispatch(storeSlice.actions.set_loading_text('loading..'));

    let qparams: anyObject = {
        params: {
            page: state[`page`],
            paginate: state[`paginate`],
            search_key: state[`search_key`],
            orderByCol: state[`orderByCol`],
            orderByAsc: state[`orderByAsc`],
            show_active_data: state[`show_active_data`],
            select_fields: state[`select_fields`],
            role: state[`role`],
        },
    };

    let response: { [key: string]: any } = {};
    let url = `${api_host}${end_point}/${api_prefix}`;
    let full_url: URL = new URL(url);
    let fetch_only_latest: boolean = state[`only_latest_data`];

    for (let param in qparams.params) {
        full_url.searchParams.set(param, qparams.params[param]);
    }

    for (let param in state.filter_criteria) {
        full_url.searchParams.set(param, state.filter_criteria[param]);
    }

    full_url.searchParams.set('user_type', 'employee');

    if (
        state[`url`] &&
        state['search_key'].length === 0 &&
        Object.keys(state.filter_criteria).length
    ) {
        url = state[`url`];
        // response = await axios.get(url, qparams);
        response = await fetchDataAndUpdateCache(url, fetch_only_latest);
    } else {
        // response = await axios.get(url, qparams);
        response = await fetchDataAndUpdateCache(
            full_url.href,
            fetch_only_latest,
        );
    }

    // dispatch(commonStore.actions.set_duration(response.duration));

    dispatch(commonStore.actions.set_cached(response.totalStorage));

    dispatch(storeSlice.actions.set_all(response.data));

    dispatch(storeSlice.actions.set_is_loading(false));

    return response.data;
};

export const all_employee = createAsyncThunk(`${store_prefix}/all`, fetch_api);
