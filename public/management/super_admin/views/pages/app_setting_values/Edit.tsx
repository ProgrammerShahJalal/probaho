import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Header from './components/management_data_page/Header';
import Footer from './components/management_data_page/Footer';
import { useSelector } from 'react-redux';
import setup from './config/setup';
import { RootState, useAppDispatch } from '../../../store';
import { details } from './config/store/async_actions/details';
import { initialState } from './config/store/inital_state';
import { Link, useParams } from 'react-router-dom';
import storeSlice from './config/store';
import { update } from './config/store/async_actions/update';
import Input from './components/management_data_page/Input';
import InputImage from './components/management_data_page/InputImage';
import TextArea from './components/management_data_page/TextArea';
import TextEditor from './components/management_data_page/TextEditor';
import FaqEditor from './components/management_data_page/FaqEditor';
import StatisticalInfoEditor from './components/management_data_page/StatisticalInfoEditor';

export interface Props {}

const Edit: React.FC<Props> = () => {
  const state: typeof initialState = useSelector((state: RootState) => state[setup.module_name]);
  const dispatch = useAppDispatch();
  const params = useParams();
  const formRef = useRef<HTMLFormElement>(null);
  const [imageData, setImageData] = useState<{ files: File[]; previews: string[] }>({ files: [], previews: [] });
  const [editorContent, setEditorContent] = useState<string>('');
  const [faqData, setFaqData] = useState<Array<{ question: string; answer: string; url: string }>>([]);
  const [statisticalInfoData, setStatisticalInfoData] = useState<Array<{ id: number; title: string; count: number | string; icon: string; }>>([]);

  useEffect(() => {
    dispatch(storeSlice.actions.set_item({}));
    dispatch(details({ id: params.id }) as any);
  }, [dispatch, params.id]);

  const get_value = useCallback(
    (key: string): string | string[] => {
      try {
        const value = state.item[key] || state.item?.info?.[key];
        if (key === 'value' && typeof value === 'string' && value.startsWith('[')) {
          try {
            return JSON.parse(value);
          } catch {
            return value;
          }
        }
        return value || '';
      } catch (error) {
        return '';
      }
    },
    [state.item],
  );

  const defaultPreview = useMemo(() => get_value('value'), [get_value]);

  const isGallery = ['Home Gallary', 'Event Gallary'].includes(get_value('title') as string);
  const isContentBox = ['Privacy Policy', 'Terms'].includes(get_value('title') as string);
  const isFaqOrStatisticalInfo = ['Statistical Info', 'FAQ'].includes(get_value('title') as string);

  const handleImageChange = useCallback((data: { files: File[]; previews: string[] }) => {
    setImageData(data);
  }, []);

  const handleEditorChange = useCallback((content: string) => {
    setEditorContent(content);
  }, []);

  async function handle_submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form_data = new FormData(e.target as HTMLFormElement);
    const currentTitle = get_value('title') as string;

    if (state.item.type !== 'file') {
        if (isFaqOrStatisticalInfo && currentTitle === 'FAQ') {
            form_data.set('value', JSON.stringify(faqData));
        } else if (isFaqOrStatisticalInfo && currentTitle === 'Statistical Info') {
            form_data.set('value', JSON.stringify(statisticalInfoData)); // Use statisticalInfoData here
        } else if (isContentBox) { // isContentBox handles types like 'Privacy Policy', 'Terms'
            form_data.set('value', editorContent);
        }
        // For simple TextAreas not covered by the above, their values are already in form_data
        // as captured by `new FormData(e.target as HTMLFormElement)`.
    }

    if (state.item.type === 'file') {
      form_data.delete('value');
      if (imageData.previews.length > 0) {
        const filteredPreviews = imageData.previews.filter((preview) => !preview.startsWith('data:'));
        if (filteredPreviews.length > 0) {
          form_data.append('value', JSON.stringify(filteredPreviews));
        }
      }
      if (imageData.files.length > 0) {
        imageData.files.forEach((file, index) => {
          if (file.size > 0) {
            form_data.append(`value[${index}]`, file);
          }
        });
      }
    }

    if (isGallery) {
      form_data.append('isGallery', isGallery.toString());
    }

    await dispatch(update(form_data) as any);

    if (state.item.type === 'file') {
      formRef.current?.reset();
      setImageData({ files: [], previews: imageData.previews });
    }
  }

  return (
    <div className="page_content">
      <div className="explore_window fixed_size">
        <Header page_title={setup.edit_page_title} />

        {Object.keys(state.item).length > 0 && (
          <div className="content_body custom_scroll">
            <form ref={formRef} onSubmit={handle_submit} className="mx-auto pt-3">
              <input type="hidden" name="id" defaultValue={get_value('id') as string} />
              <input
                type="hidden"
                name="app_setting_key_id"
                defaultValue={get_value('app_setting_key_id') as string}
              />

              <div>
                <div key={'title'} className="form-group form-vertical">
                  <h6>Title: {get_value('title')}</h6>
                </div>

                {['value'].map((field) => {
                  const currentTitle = get_value('title') as string;
                  return (
                    <div key={field} className="form-group form-vertical">
                      {state.item.type === 'file' ? (
                        <InputImage
                          label="Upload file"
                          name={field}
                          defalut_preview={defaultPreview}
                          multiple={isGallery}
                          onImageChange={handleImageChange}
                        />
                      ) : currentTitle === 'FAQ' && isFaqOrStatisticalInfo ? ( // Check isFaqOrStatisticalInfo to be sure
                        <FaqEditor
                          value={typeof state.item.value === 'string' ? state.item.value : ''}
                          onChange={setFaqData}
                        />
                      ) : currentTitle === 'Statistical Info' && isFaqOrStatisticalInfo ? (
                        <StatisticalInfoEditor
                          value={typeof state.item.value === 'string' ? state.item.value : ''}
                          onChange={setStatisticalInfoData}
                        />
                      ) : isContentBox ? (
                        <TextEditor
                          name={field}
                          value={get_value(field) as string}
                          onChange={handleEditorChange}
                        />
                      ) : (
                        <TextArea name={field} value={get_value(field) as string} />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="form-group form-vertical">
                <label />
                <div className="form_elements">
                  <button className="btn btn-outline-info">Submit</button>
                </div>
              </div>
            </form>
          </div>
        )}

        <Footer>
          {state?.item?.id && (
            <li>
              <Link to={`/${setup.route_prefix}/details/${state.item.id}`} className="outline">
                <span className="material-symbols-outlined fill">visibility</span>
                <div className="text">Details</div>
              </Link>
            </li>
          )}
        </Footer>
      </div>
    </div>
  );
}; 

export default Edit;
