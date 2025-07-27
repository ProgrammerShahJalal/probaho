import React from 'react';
import setup from '../../config/setup';
import { anyObject } from '../../../../../common_types/object';
import { RootState, useAppDispatch } from '../../../../../store';
import { initialState } from '../../config/store/inital_state';
import { useSelector } from 'react-redux';
import { inactive } from '../../config/store/async_actions/inactive';
export interface Props {
    item: anyObject;
}

const InactiveButton: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const dispatch = useAppDispatch();

    async function handle_inactive(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        e.preventDefault();

        const confirm = await (window as anyObject).s_confirm('inactive data');
        if (confirm) {
            dispatch(inactive({ id: props.item.id }) as any);
        }
    }
    if (!state.show_active_data) {
        return <></>;
    }
    return (
        <>
            <a
                onClick={(e) => handle_inactive(e)}
                href={`/${setup.route_prefix}/inactive/${props.item.id}`}
            >
                <span className="icon-power-off text-secondary"></span> <span className="text text-white">Inactive</span>
            </a>
        </>
    );
};

export default InactiveButton;
