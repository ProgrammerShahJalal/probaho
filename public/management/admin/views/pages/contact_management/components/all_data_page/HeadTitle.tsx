import React from 'react';
import { useSelector } from 'react-redux';
import setup from '../../config/setup';
import { RootState } from '../../../../../store';
import { initialState } from '../../config/store/inital_state';
export interface Props {
    title?: string;
}

const HeadTitle: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    return (
        <div className="title no_move" id="users_drag">
            <h5>
                {props.title ? props.title : setup.all_page_title}

                {/* {state.is_loading && <span> loading..</span>} */}
            </h5>
        </div>
    );
};

export default HeadTitle;
