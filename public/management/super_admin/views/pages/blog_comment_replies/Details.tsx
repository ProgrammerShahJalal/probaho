import React, { useEffect } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { details } from './config/store/async_actions/details';
import { initialState } from './config/store/inital_state';
import storeSlice from './config/store';

export interface Props {}

const Details: React.FC<Props> = () => {
  const state: typeof initialState = useSelector(
    (state: RootState) => state[setup.module_name]
  );
  const dispatch = useAppDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(storeSlice.actions.set_item({}));
    dispatch(details({ id: params.id }) as any);
  }, [dispatch, params.id]);

  // Utility function to get value from state.item
  const get_value = (key: string) => {
    try {
      if (key === 'user_id' && state.item.user) {
        return `${state.item.user.first_name} ${state.item.user.last_name}`;
      }
      if (key === 'blog_id' && state.item.blog) {
        return state.item.blog.title;
      }
      if (key === 'parent_comment_id' && state.item.parent_comment) {
        return state.item.parent_comment.comment;
      }
      return state.item[key] || state.item?.info[key] || '';
    } catch (error) {
      return '';
    }
  };

  // Configuration for table rows
  const tableConfig = [
    { key: 'id', label: 'ID' },
    { key: 'blog_id', label: 'Blog Title' },
    { key: 'user_id', label: 'Commenter' },
    { key: 'parent_comment_id', label: 'Parent Comment' },
    { key: 'comment', label: 'Reply' },
    {
      key: 'status',
      formatter: (value: string) => value || 'N/A',
    },
  ];

  return (
    <div className="page_content">
      <div className="explore_window fixed_size">
        <Header page_title={setup.details_page_title} />

        {Object.keys(state.item).length > 0 && (
          <div className="content_body custom_scroll">
            <table className="table quick_modal_table table-hover">
              <tbody>
                {tableConfig.map(({ key, label, formatter }) => (
                  <tr key={key}>
                    <td>{label || key.replaceAll('_', ' ')}</td>
                    <td>:</td>
                    <td>
                      {formatter ? formatter(get_value(key)) : get_value(key)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Footer>
          {state.item?.id && (
            <li>
              <Link
                to={`/${setup.route_prefix}/edit/${state.item.id}`}
                className="btn-outline-info outline"
              >
                <span className="material-symbols-outlined fill">
                  edit_square
                </span>
                <div className="text">Edit Reply</div>
              </Link>
            </li>
          )}
        </Footer>
      </div>
    </div>
  );
};

export default Details;
