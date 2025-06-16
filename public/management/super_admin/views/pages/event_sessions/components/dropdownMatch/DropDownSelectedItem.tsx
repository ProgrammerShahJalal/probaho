import React from 'react';
import { anyObject } from '../../../../../common_types/object';

export interface Props {
    selectedList: anyObject[];
    onRemove: (id: number) => void;
}

const DropDownSelectedItem: React.FC<Props> = ({
    selectedList,
    onRemove,
}) => {
    return (
        <>
            {selectedList.length ? (
                selectedList.map((i) => {
                    return (
                        <div id={i.id.toString()} key={i.id} className="selected_item">
                            <div className="label">{i.title}</div>
                            <div
                                onClick={() => onRemove(i.id)}
                                className="remove"
                            >
                                <span className="material-symbols-outlined fill">
                                    close
                                </span>
                            </div>
                        </div>
                    );
                })
            ) : (
                <span className="no_item_selected_text">select item</span>
            )}
        </>
    );
};

export default DropDownSelectedItem;