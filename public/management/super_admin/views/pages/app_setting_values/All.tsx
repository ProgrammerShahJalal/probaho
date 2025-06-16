import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../store';
import { all } from './config/store/async_actions/all';
import setup from './config/setup';
import { initialState } from './config/store/inital_state';
import Header from './components/all_data_page/Header';
import Paginate from '../../components/Paginate';
import Filter from './components/canvas/Filter';
import QuickView from './components/canvas/QuickView';
import storeSlice from './config/store';
import { anyObject } from '../../../common_types/object';
import TableRowAction from './components/all_data_page/TableRowAction';
import SelectItem from './components/all_data_page/SelectItem';
import SelectAll from './components/all_data_page/SelectIAll';
import TableHeading from './components/all_data_page/TableHeading';
import { useSearchParams } from 'react-router-dom';

export interface Props {}

const All: React.FC<Props> = () => {
  const state: typeof initialState = useSelector(
    (state: RootState) => state[setup.module_name],
  );
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    dispatch(
      storeSlice.actions.set_select_fields(
        'title,value,app_setting_key_id,is_default,status',
      ),
    );
    dispatch(all({}));
  }, [dispatch, searchParams]);

  function quick_view(data: anyObject = {}) {
    dispatch(storeSlice.actions.set_item(data));
    dispatch(storeSlice.actions.set_show_quick_view_canvas(true));
  }

  const render_value = (item: anyObject) => {
    const { value, app_settings } = item;
    const type = app_settings?.type || item.type;

    if (type === 'file') {
      let imagePaths: string[] = [];
      try {
        if (typeof value === 'string' && value.startsWith('[')) {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            imagePaths = parsed.filter((path: unknown) => typeof path === 'string');
          }
        } else if (typeof value === 'string') {
          imagePaths = [value];
        }
      } catch {
        imagePaths = typeof value === 'string' ? [value] : [];
      }

      if (imagePaths.length === 0) {
        return 'No images';
      }

      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <img
            src={`/${imagePaths[0]}`} // Adjust base URL if needed
            alt="Thumbnail"
            style={{
              maxWidth: '60px',
              maxHeight: '60px',
              objectFit: 'cover',
              borderRadius: '4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
            onError={(e) => {
              e.currentTarget.src = '/avatar.png'; // Fallback image
              console.log(`Failed to load image: ${imagePaths[0]}`);
            }}
          />
          {imagePaths.length > 1 && (
            <span style={{ fontSize: '12px', color: '#FFFFFF' }}>
              +{imagePaths.length - 1} more
            </span>
          )}
        </div>
      );
    }

    // For text or other types
    const text = value?.toString() || '';
    const maxLength = 32;
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  return (
    <div className="page_content">
      <div className="explore_window fixed_size">
        <Header />

        <div className="content_body">
          <div className="data_list">
            <div className="table_responsive custom_scroll">
              <table>
                <thead>
                  <tr>
                    <th />
                    <th>
                      <SelectAll />
                    </th>
                    <TableHeading label="ID" col_name="id" sort={true} />
                    <TableHeading label="Title" col_name="title" sort={true} />
                    <TableHeading label="Value" col_name="value" sort={false} />
                  </tr>
                </thead>
                <tbody id="all_list">
                  {(state.all as any)?.data?.length > 0 ? (
                    (state.all as any)?.data?.map((item: anyObject) => (
                      <tr key={item.id} className={`table_rows table_row_${item.id}`}>
                        <td>
                          <TableRowAction item={item} />
                        </td>
                        <td>
                          <SelectItem item={item} />
                        </td>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{render_value(item)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        No data found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <Paginate
              set_url={storeSlice.actions.set_url}
              set_paginate={storeSlice.actions.set_paginate}
              set_page={storeSlice.actions.set_page}
              all={all}
              data={state.all as any}
              selected_paginate={state.paginate}
            />
          </div>
        </div>
      </div>

      <Filter />
      <QuickView />
    </div>
  );
};

export default All;
