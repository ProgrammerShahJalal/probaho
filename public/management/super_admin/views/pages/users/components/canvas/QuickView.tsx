import React from 'react';
import { createPortal } from 'react-dom';
import { RootState, useAppDispatch } from '../../../../../store';
import storeSlice from '../../config/store';
import { initialState } from '../../config/store/inital_state';
import { useSelector } from 'react-redux';
import setup from '../../config/setup';
import moment from 'moment/moment';
export interface Props { }

const modalRoot = document.getElementById('filter-root');

const QuickView: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    const dispatch = useAppDispatch();

    function close_canvas(action: boolean = true) {
        dispatch(storeSlice.actions.set_show_quick_view_canvas(action));
    }

    // State to store user roles map
    const [userRolesMap, setUserRolesMap] = React.useState<{ [key: number]: string }>({});

    // Fetch user roles and store them in a map
    React.useEffect(() => {
        fetch(
            `/api/v1/user-roles?orderByCol=id&orderByAsc=true&show_active_data=true&paginate=10&select_fields=`,
        )
            .then((res) => res.json())
            .then((data) => {
                const roleMap: { [key: number]: string } = {};
                data?.data?.data?.forEach(
                    (role: { serial: number; title: string }) => {
                        roleMap[role.serial] = role.title;
                    },
                );
                setUserRolesMap(roleMap);
            })
            .catch((err) => console.error('Error fetching user roles:', err));
    }, []);

    // Function to map role_serial array to role titles
    function getRoleTitles(roleSerial: any): string {
        try {
            let serials: number[] = [];
            // If value is a stringified array, parse it
            if (typeof roleSerial === 'string') {
                try {
                    const parsed = JSON.parse(roleSerial);
                    if (Array.isArray(parsed)) serials = parsed;
                } catch {
                    // fallback
                }
            }
            // If value is already an array, use it
            if (Array.isArray(roleSerial)) serials = roleSerial;
            // If value is a single number, treat as array
            if (typeof roleSerial === 'number') serials = [roleSerial];

            // Map each serial to its role title and join
            const roles = serials
                .map((serial) => userRolesMap[serial] || 'Unknown')
                .filter((role) => role !== 'Unknown');
            return roles.length > 0 ? roles.join(', ') : 'Unknown';
        } catch (error) {
            return 'Unknown';
        }
    }

    // Function to convert base_salary to words
    function convertSalaryToWords(value) {
        try {
            if (value && (window as any).convertAmount) {
                return `${(window as any).convertAmount(value).bn} টাকা মাত্র`;
            }
            return 'N/A';
        } catch (error) {
            console.error('Error converting salary to words:', error);
            return 'N/A';
        }
    }

    if (modalRoot && state.show_quick_view_canvas) {
        return createPortal(
            <div className="off_canvas quick_view">
                <div className="off_canvas_body">
                    <div className="header">
                        <h3 className="heading_text">Quick View</h3>
                        <button
                            className="close_button"
                            onClick={() => close_canvas(false)}
                        >
                            <span className="material-symbols-outlined fill">
                                close
                            </span>
                        </button>
                    </div>

                    <div className="data_content">
                        <table className="table quick_modal_table">
                            <tbody>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th>
                                        <img
                                            src={
                                                state.item.photo
                                                    ? (state.item.photo.startsWith('http')
                                                        ? state.item.photo
                                                        : `/${state.item.photo}`)
                                                    : '/assets/dashboard/images/avatar.png'
                                            }
                                            alt=""
                                            style={{
                                                height: 30,
                                            }}
                                        />

                                    </th>
                                </tr>
                                <tr>
                                    <th>Name</th>
                                    <th>:</th>
                                    <th>{state.item.name}</th>
                                </tr>
                                <tr>
                                    <th>Role</th>
                                    <th>:</th>
                                    <th>{getRoleTitles(state.item.role_serial)}</th>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <th>:</th>
                                    <th>{state.item.email}</th>
                                </tr>
                                <tr>
                                    <th>Phone Number</th>
                                    <th>:</th>
                                    <th>{state.item.phone_number}</th>
                                </tr>
                                <tr>
                                    <th>Is Verified</th>
                                    <th>:</th>
                                    <th>{state.item.is_approved === '1' ? 'Yes' : 'No'}</th>
                                </tr>
                                <tr>
                                    <th>Is Approved</th>
                                    <th>:</th>
                                    <th>{state.item.is_verified === '1' ? 'Yes' : 'No'}</th>
                                </tr>
                                <tr>
                                    <th>Is Blocked</th>
                                    <th>:</th>
                                    <th>{state.item.is_blocked === '1' ? 'Yes' : 'No'}</th>
                                </tr>
                                <tr>
                                    <th>Join Date</th>
                                    <th>:</th>
                                    <th>{state.item.join_date ? moment.utc(state.item.join_date).local().format('DD MMMM YYYY') : 'N/A'}</th>
                                </tr>
                                <tr>
                                    <th>Base Salary</th>
                                    <th>:</th>
                                    <th>{state.item.base_salary ? state.item.base_salary : 'N/A'}</th>
                                </tr>
                                {/* Add row for base_salary in words */}
                                <tr>
                                    <td>Base Salary in Words</td>
                                    <td>:</td>
                                    <td>{convertSalaryToWords(state.item.base_salary)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="off_canvas_overlay"></div>
            </div>,
            modalRoot,
        );
    } else {
        return <></>;
    }
};

export default QuickView;
function setUserRolesMap(roleMap: { [key: number]: string; }) {
    throw new Error('Function not implemented.');
}

