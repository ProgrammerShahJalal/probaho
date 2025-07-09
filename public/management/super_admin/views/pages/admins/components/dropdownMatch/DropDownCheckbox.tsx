import React, { useRef } from 'react';
import { anyObject } from '../../../../../common_types/object';

export interface Props {
    item?: anyObject;
    selectedList?: anyObject[];
    setSelectedList?: React.Dispatch<React.SetStateAction<anyObject[]>>;
    multiple?: boolean;
    checked?: boolean;
    onChange?: () => void;
}

const DropDownCheckbox: React.FC<Props> = ({
    item,
    multiple = false,
    selectedList = [],
    setSelectedList,
    checked = false,
    onChange,
}) => {
    const check_box_el = useRef<HTMLInputElement | null>(null);

    /** handlers */
    function select_item() {
        if (onChange) {
            onChange();
            return;
        }

        if (!setSelectedList || !item) return;
        
        let temp = [...selectedList];
        if (!multiple) {
            temp = [];
        }
        const checkExist = temp.findIndex((i) => i.id === item.id);
        if (checkExist >= 0) {
            temp.splice(checkExist, 1);
        } else {
            temp.push(item);
        }
        setSelectedList(temp);
    }

    return (
        <input
            ref={check_box_el}
            onChange={select_item}
            checked={checked}
            type="checkbox"
            id={item ? `drop_item_${item.id}` : undefined}
            className="form_checkbox"
        />
    );
};

export default DropDownCheckbox;