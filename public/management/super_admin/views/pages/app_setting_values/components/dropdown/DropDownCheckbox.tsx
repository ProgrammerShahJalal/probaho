import React, { useRef } from 'react';
import { anyObject } from '../../../../../common_types/object';
export interface Props {
    item: anyObject;
    selectedList: anyObject[];
    setSelectedList: React.Dispatch<React.SetStateAction<anyObject[]>>;
    multiple: true | false;
}

const DropDownCheckbox: React.FC<Props> = ({
    item,
    multiple,
    selectedList,
    setSelectedList,
}) => {
    const check_box_el = useRef<HTMLInputElement | null>(null);

    /** handlers */
    function select_item() {
        let temp = [...selectedList];
        if (multiple === false) {
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

    function is_checked(): boolean {
        let check = selectedList.find((i) => i.id === item.id) ? true : false;
        if (!check && check_box_el.current) {
            check_box_el.current.checked = false;
        }
        return check;
    }

    return (
        <input
            ref={check_box_el}
            onChange={select_item}
            defaultChecked={is_checked()}
            type="checkbox"
            id={`drop_item_${item.id}`}
            className="form_checkbox"
        />
    );
};

export default DropDownCheckbox;
