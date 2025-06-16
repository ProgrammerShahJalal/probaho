import React, { useEffect } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import { useSelector } from 'react-redux';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { details } from './config/store/async_actions/details';
import { initialState } from './config/store/inital_state';
import { Link, useParams } from 'react-router-dom';
import storeSlice from './config/store';

export interface Props {}

const Details: React.FC<Props> = () => {
  const state: typeof initialState = useSelector(
    (state: RootState) => state[setup.module_name],
  );
  const dispatch = useAppDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(storeSlice.actions.set_item({}));
    dispatch(details({ id: params.id }) as any);
  }, [dispatch, params.id]);

  const get_value = (key: string) => {
    try {
      const value = state.item[key] || state.item?.info?.[key];
      if (key === 'value' && state.item.type === 'file' && typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            return parsed.filter((path: unknown) => typeof path === 'string');
          }
        } catch {
          return [value]; // Fallback to raw value as a single-item array
        }
      }
      return value || '';
    } catch {
      return '';
    }
  };

  const render_value = (key: string) => {
    const value = get_value(key);
    const itemTitle = get_value('title'); // Get the title of the current item

    // 1. Handle file type
    if (key === 'value' && state.item.type === 'file' && Array.isArray(value)) {
      if (value.length === 0) {
        return 'No images';
      }
      return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {value.map((path: string, index: number) => (
            <img
              key={index}
              src={`/${path}`} // Adjust base URL if needed
              alt={`Image ${index + 1}`}
              style={{
                maxHeight: '100px',
                objectFit: 'cover',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'; // Hide broken images
                console.log(`Failed to load image: ${path}`);
              }}
            />
          ))}
        </div>
      );
    }
    // 2. Handle FAQ data (JSON)
    else if (key === 'value' && itemTitle === 'FAQ' && typeof value === 'string') {
      try {
        const faqArray = JSON.parse(value);
        if (Array.isArray(faqArray)) {
          return (
            <div>
              {faqArray.map((faqItem: any, index: number) => (
                <div key={index} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                  <h5 style={{ fontWeight: 'bold', marginBlockStart: '0.5em', marginBlockEnd: '0.5em' }}>{faqItem.question}</h5>
                  <p style={{ marginBlockStart: '0.5em', marginBlockEnd: '0.5em' }}>{faqItem.answer}</p>
                  {faqItem.url && (
                    <a href={faqItem.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.9em', color: '#007bff' }}>
                      More info
                    </a>
                  )}
                </div>
              ))}
            </div>
          );
        } else {
          return <div>Invalid FAQ data format: Expected an array.</div>; // Not an array
        }
      } catch (error) {
        console.error("Failed to parse FAQ JSON:", error);
        return <div>Error displaying FAQ: Malformed content.</div>; // Parsing error
      }
    }
    // 3. Handle Statistical Info data (JSON)
    else if (key === 'value' && itemTitle === 'Statistical Info' && typeof value === 'string') {
      try {
        const statsArray = JSON.parse(value);
        if (Array.isArray(statsArray)) {
          return (
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', gap: '10px' }}>
              {statsArray.map((statItem: any, index: number) => (
                <div key={index} style={{ 
                    border: '1px solid #eee', 
                    padding: '15px', 
                    margin: '5px', 
                    textAlign: 'center', 
                    borderRadius: '5px',
                    backgroundColor: '#f9f9f9',
                    minWidth: '150px', // Ensure items have some width
                    flex: '1 1 150px', // Flex properties for responsiveness
                }}>
                  {statItem.icon && <i className={statItem.icon} style={{ fontSize: '2em', marginBottom: '10px', display:'block', color: '#F2184F' }}></i>}
                  <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#333' }}>
                    {statItem.value !== undefined ? statItem.value : statItem.count}
                  </div>
                  <div style={{ fontSize: '0.9em', color: '#555' }}>
                    {statItem.title || statItem.label}
                  </div>
                </div>
              ))}
            </div>
          );
        } else {
          return <div>Invalid Statistical Info data format: Expected an array.</div>;
        }
      } catch (error) {
        console.error("Failed to parse Statistical Info JSON:", error);
        return <div>Error displaying Statistical Info: Malformed content.</div>;
      }
    }
    // 4. Handle other HTML content (Terms, Policy)
    else if (
      key === 'value' &&
      typeof value === 'string' &&
      ["Terms", "Privacy Policy"].includes(itemTitle) // "FAQ" & "Statistical Info" are removed
    ) {
      return <div dangerouslySetInnerHTML={{ __html: value }} />;
    }

    // 5. Fallback for other types
    return value?.toString ? value.toString() : '';
  };

  return (
    <div className="page_content">
      <div className="explore_window fixed_size">
        <Header page_title={setup.details_page_title} />

        {Object.keys(state.item).length > 0 && (
          <div className="content_body custom_scroll">
            <table className="table quick_modal_table table-hover">
              <tbody>
                {['title', 'value'].map((key) => {
                  const currentValue = get_value(key);
                  const isTargetTitle =
                    key === 'title' &&
                    [
                      'Terms',
                      'Privacy Policy',
                      'Statistical Info',
                      'FAQ',
                    ].includes(currentValue);
                  const valueCellStyle = isTargetTitle
                    ? { fontWeight: 'bold', fontSize: '1.1em' }
                    : {};

                  return (
                    <tr key={key}>
                      <td>{key.replaceAll('_', ' ')}</td>
                      <td>:</td>
                      <td style={valueCellStyle}>{render_value(key)}</td>
                    </tr>
                  );
                })}
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
                <span className="material-symbols-outlined fill">edit_square</span>
                <div className="text">Edit</div>
              </Link>
            </li>
          )}
        </Footer>
      </div>
    </div>
  );
};

export default Details;
