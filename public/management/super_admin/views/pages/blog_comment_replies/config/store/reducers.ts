import { PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './inital_state';
import { anyObject } from '../../../../../common_types/object';

export const store_reducers = {
    set_is_loading: (
        state: typeof initialState,
        action: PayloadAction<boolean>,
    ) => {
        state.is_loading = action.payload;
    },
    set_loading_text: (
        state: typeof initialState,
        action: PayloadAction<string>,
    ) => {
        state.loading_text = action.payload;
    },

    set_role: (state: typeof initialState, action: PayloadAction<string>) => {
        state.role = action.payload;
    },

    set_url: (state: typeof initialState, action: PayloadAction<string>) => {
        state.url = action.payload;
    },
    set_all: (state: typeof initialState, action: PayloadAction<object>) => {
        state.all = action.payload;
    },
    set_page: (state: typeof initialState, action: PayloadAction<number>) => {
        state.page = action.payload;
    },
    set_paginate: (
        state: typeof initialState,
        action: PayloadAction<number>,
    ) => {
        state.paginate = action.payload;
    },
    set_search_key: (
        state: typeof initialState,
        action: PayloadAction<string>,
    ) => {
        state.search_key = action.payload;
    },
    set_order_by_col: (
        state: typeof initialState,
        action: PayloadAction<string>,
    ) => {
        state.orderByCol = action.payload;
    },
    set_order_by_asc: (
        state: typeof initialState,
        action: PayloadAction<boolean>,
    ) => {
        state.orderByAsc = action.payload;
    },
    set_only_latest_data: (
        state: typeof initialState,
        action: PayloadAction<boolean>,
    ) => {
        state.only_latest_data = action.payload;
    },
    set_show_active_data: (
        state: typeof initialState,
        action: PayloadAction<boolean>,
    ) => {
        state.show_active_data = action.payload;
    },
    set_select_fields: (
        state: typeof initialState,
        action: PayloadAction<string>,
    ) => {
        state.select_fields = action.payload;
    },

    set_show_filter_canvas: (
        state: typeof initialState,
        action: PayloadAction<boolean>,
    ) => {
        state.show_filter_canvas = action.payload;
    },

    set_item: (state: typeof initialState, action: PayloadAction<object>) => {
        state.item = action.payload;
    },
    set_show_quick_view_canvas: (
        state: typeof initialState,
        action: PayloadAction<boolean>,
    ) => {
        state.show_quick_view_canvas = action.payload;
    },

    set_filter_criteria: (
        state: typeof initialState,
        action: PayloadAction<{ key: string; value: string | number }>,
    ) => {
        state.filter_criteria[action.payload.key] = action.payload.value;
    },

    set_selected: (
        state: typeof initialState,
        action: PayloadAction<anyObject[]>,
    ) => {
        state.selected = action.payload;
    },
    set_select_all: (
        state: typeof initialState,
        action: PayloadAction<anyObject[]>,
    ) => {
        state.selected = action.payload;
    },
};
