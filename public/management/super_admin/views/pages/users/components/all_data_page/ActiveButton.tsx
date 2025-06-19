import React from 'react';
import setup from '../../config/setup';
import { anyObject } from '../../../../../common_types/object';
import { RootState, useAppDispatch } from '../../../../../store';
import { initialState } from '../../config/store/inital_state';
import { useSelector } from 'react-redux';
import { active } from '../../config/store/async_actions/active';
export interface Props {
    item: anyObject;
}

const ActiveButton: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const dispatch = useAppDispatch();

    async function handle_active(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        e.preventDefault();

        const confirm = await (window as anyObject).s_confirm('activate data');
        if (confirm) {
            dispatch(active({ id: props.item.id }) as any);
        }
    }
    // Only show if item is deactive
    if (props.item.status !== 'deactive') {
        return <></>;
    }
    return (
        <>
            <a
                onClick={(e) => handle_active(e)}
                href={`/${setup.route_prefix}/active/${props.item.id}`}
            >
                <span className="icon-eye text-success"></span> <span className="text text-white">Active</span>
            </a>
        </>
    );
};

export default ActiveButton;
