import React from 'react';
import { anyObject } from '../../../../../common_types/object';
export interface Props {
    selectedList: anyObject[];
    setSelectedList: React.Dispatch<React.SetStateAction<anyObject[]>>;
}

const DropDownSelectedItem: React.FC<Props> = ({
    selectedList,
    setSelectedList,
}) => {
    function remove_item(index: number) {
        const temp = [...selectedList];
        temp.splice(index, 1);
        setSelectedList(temp);
    }
    return (
        <>
            {selectedList.length ? (
                selectedList.map((i, index) => {
                    return (
                        <div id={i.id} key={index} className="selected_item">
                            <div className="label">{i.name}</div>
                            <div
                                onClick={() => remove_item(index)}
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
