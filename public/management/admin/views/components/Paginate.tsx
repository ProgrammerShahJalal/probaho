import React from 'react';
import parse from 'html-react-parser';
import { useAppDispatch } from '../../store';
import { anyObject } from '../../common_types/object';
export interface Props {
    data:
        | {
              current_page: number;
              data: [{ [key: string]: any }];
              first_page_url: string;
              from: number;
              last_page: number;
              last_page_url: string;
              links: [{ [key: string]: any }];
              next_page_url: string | null;
              path: string;
              per_page: number;
              prev_page_url: string | null;
              to: number;
              total: number;
          }
        | anyObject;
    set_url: Function;
    all: Function;
    set_paginate: Function;
    set_page: Function;
    selected_paginate: number;
}

const Paginate: React.FC<Props> = ({
    data,
    set_url,
    set_page,
    all,
    set_paginate,
    selected_paginate,
}: Props) => {
    const dispatch = useAppDispatch();

    function change_page(url: string, e, label) {
        e.preventDefault();
        const final_url: InstanceType<typeof URL> = new URL(url);
        let page_no: string | null = '';

        if (isNaN(label) === false) {
            dispatch(set_page(label));
        }
        if (isNaN(label)) {
            page_no = new URL(url).searchParams.get('page');
            dispatch(set_page(page_no));
        }
        if (page_no) {
            final_url.searchParams.set('page', page_no);
        }
        dispatch(set_url(final_url.href));
        dispatch(all({}));
    }

    function set_page_limit(value) {
        dispatch(set_url(''));
        dispatch(set_page(1));
        dispatch(set_paginate(value));
        dispatch(all({}));
    }

    if (data && !Object.keys(data).length) {
        return <></>;
    }
    return (
        <div className="pagination_part">
            <ul className="pagination">
                {data?.links?.map((i) => {
                    return (
                        <li key={i.label}>
                            <a
                                onClick={(e) =>
                                    i.url && change_page(i.url, e, i.label)
                                }
                                className={`${i.active ? 'active' : ''}`}
                                href={i.url}
                            >
                                {typeof i.label === 'string'
                                    ? parse(i.label)
                                    : i.label}
                            </a>
                        </li>
                    );
                })}
            </ul>
            <div className="showing">
                {data?.from} - {data?.to} of {data?.total}
            </div>
            <div className="limit">
                <select
                    value={selected_paginate}
                    onChange={(e) => set_page_limit(e.target.value)}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                </select>
            </div>
        </div>
    );
};

export default Paginate;
