import React from 'react';
import setup from '../../config/setup';
import { anyObject } from '../../../../../common_types/object';
import { useAppDispatch } from '../../../../../store';
import { destroy } from '../../config/store/async_actions/destroy';
export interface Props {
    item: anyObject;
    onDelete: (id: number) => void;
}

const DestroyButtonSub: React.FC<Props> = (props: Props) => {
    const dispatch = useAppDispatch();

    async function handle_delete(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        e.preventDefault();

        const confirm = await (window as anyObject).s_confirm(
            'Delete permanently.',
        );
        if (confirm) {
            dispatch(destroy({ id: props.item.id }) as any);
            props.onDelete(props.item.id);
        }
    }
    return (
        <>
            <a
                onClick={(e) => handle_delete(e)}
                href={`/${setup.route_prefix}/destroy/${props.item.id}`}
            >
                Destroy
            </a>
        </>
    );
};

export default DestroyButtonSub;
