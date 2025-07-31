import React, { useEffect, useState } from 'react'
import Input from './management_data_page/Input'
import { anyObject } from '../../../../common_types/object';
import { NomineeType } from '../helpers/nominee_helpers';

type Props = {
    FormPageNominees: NomineeType[];
    setFromPageNominees: (response: NomineeType[]) => void;
    nominee_index: number;
}

function Nominee({ FormPageNominees, setFromPageNominees, nominee_index }: Props) {

    function set_value(data) {
        let temp = Array.from(FormPageNominees);
        let { nominee_index, name } = data.referance_data;
        temp[nominee_index][name] = data.value;
        setFromPageNominees(temp);
    }

    // console.log(FormPageNominees);

    return (
        <>
            <div className="form_auto_fit">
                {
                    Object.keys(FormPageNominees[nominee_index]).map((i) => (
                        <div className="form-group form-vertical">
                            <Input
                                name={'nominee_' + i}
                                value={FormPageNominees[nominee_index][i]}
                                setter={set_value}
                                referance_data={{
                                    nominee_index: nominee_index,
                                    name: i,
                                }}
                            />
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default Nominee