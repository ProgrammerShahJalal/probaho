import React from 'react';

export interface Props {}

const CommonAppWindow: React.FC<Props> = (props: Props) => {
    return (
        <>
            <div
                className="explore_window false false false"
                id="users"
                style={{ zIndex: 75 }}
            >
                <div className="action_bar">
                    <div className="navigation">
                        <ul>
                            <li className="search_li">
                                {/* <a href="#" @click="show_search = !show_search"><span class="material-symbols-outlined fill">search</span></a> */}
                                <input
                                    className="search"
                                    placeholder="search.."
                                    id="table_search_box"
                                    type="search"
                                />
                            </li>
                        </ul>
                    </div>
                    <div className="title" id="users_drag">
                        <h2>users</h2>
                    </div>
                    <div className="control">
                        <ul>
                            <li>
                                <a href="#">
                                    <span className="material-symbols-outlined fill">
                                        zoom_out_map
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span className="material-symbols-outlined fill">
                                        remove
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span className="material-symbols-outlined fill">
                                        close
                                    </span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="content_body">
                    <div className="data_list">
                        <div className="table_responsive custom_scroll">
                            <table>
                                <thead>
                                    <tr>
                                        <th />
                                        <th>
                                            <input type="checkbox" />
                                        </th>
                                        <th>ID</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email</th>
                                        <th>Phone Number</th>
                                        <th>Image</th>
                                    </tr>
                                </thead>
                                <tbody id="all_list">
                                    <tr id="21" className="">
                                        <td>
                                            <span className="icon" />
                                            <div className="table_action_btns">
                                                <ul>
                                                    <li>
                                                        <a href="/user/21">
                                                            Show
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">Edit</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">Delete</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>21</td>
                                        <td>Earnest</td>
                                        <td>Wuckert</td>
                                        <td>dschmidt@example.com</td>
                                        <td>(747) 880-9945</td>
                                        <td>
                                            <img
                                                src="http://127.0.0.1:8000/avatar.png"
                                                alt=""
                                                style={{ height: 30 }}
                                            />
                                        </td>
                                    </tr>
                                    <tr id="22" className="">
                                        <td>
                                            <span className="icon" />
                                            <div className="table_action_btns">
                                                <ul>
                                                    <li>
                                                        <a href="/user/22">
                                                            Show
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">Edit</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">Delete</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>22</td>
                                        <td>Delilah</td>
                                        <td>Schmeler</td>
                                        <td>jasper.romaguera@example.org</td>
                                        <td>(951) 883-9986</td>
                                        <td>
                                            <img
                                                src="http://127.0.0.1:8000/avatar.png"
                                                alt=""
                                                style={{ height: 30 }}
                                            />
                                        </td>
                                    </tr>
                                    <tr id="23" className="">
                                        <td>
                                            <span className="icon" />
                                            <div className="table_action_btns">
                                                <ul>
                                                    <li>
                                                        <a href="/user/23">
                                                            Show
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="#">Edit</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">Delete</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                        <td>
                                            <input type="checkbox" />
                                        </td>
                                        <td>23</td>
                                        <td>Elias</td>
                                        <td>Lueilwitz</td>
                                        <td>botsford.bethel@example.net</td>
                                        <td>(406) 514-3867</td>
                                        <td>
                                            <img
                                                src="http://127.0.0.1:8000/avatar.png"
                                                alt=""
                                                style={{ height: 30 }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="pagination_part">
                            <ul className="pagination">
                                <li>
                                    <a
                                        className=""
                                        href="http://127.0.0.1:8000/api/v1/user/all?page=2"
                                    >
                                        <span>« </span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className=""
                                        href="http://127.0.0.1:8000/api/v1/user/all?page=1"
                                    >
                                        <span>1</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className=""
                                        href="http://127.0.0.1:8000/api/v1/user/all?page=2"
                                    >
                                        <span>2</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="active"
                                        href="http://127.0.0.1:8000/api/v1/user/all?page=3"
                                    >
                                        <span>3</span>
                                    </a>
                                </li>
                                <li>
                                    <a className="">
                                        <span> »</span>
                                    </a>
                                </li>
                            </ul>
                            <div className="showing">21 - 23 of 23</div>
                            <div className="limit">
                                <select name="" id="">
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <div className="action_btns">
                        <ul>
                            <li>
                                <a href="#">
                                    <span className="material-symbols-outlined fill">
                                        add
                                    </span>
                                    <div className="text">create new</div>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span className="material-symbols-outlined fill">
                                        download
                                    </span>
                                    <div className="text">Export All</div>
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <span className="material-symbols-outlined fill">
                                        upload
                                    </span>
                                    <div className="text">Import All</div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CommonAppWindow;
