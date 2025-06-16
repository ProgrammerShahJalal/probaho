import React from 'react';
import NavbarSwitch from './NavbarSwitch';

export interface Props {}

const TopHeader: React.FC<Props> = (props: Props) => {
    return (
        <>
            <div className="page-main-header">
                <div
                    className="main-header-left"
                    semilight-bg-color="bg-default-light-colo"
                >
                    <div className="logo-wrapper">
                        <a href="#/">
                            <img
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                                src="https://i.ibb.co.com/23gQkKMV/ireadwhite.png"
                                className="image-dark"
                            />
                            <img
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                               src="https://i.ibb.co.com/23gQkKMV/ireadwhite.png"
                                className="image-light"
                            />
                        </a>
                    </div>
                </div>
                <div
                    className="main-header-right row"
                    header-bg-color="bg-default-light-colo"
                >
                    <NavbarSwitch />
                    <div className="nav-right col">
                        <ul className="nav-menus">
                            {/* <li>
                      <form class="form-inline search-form">
                          <div class="form-group">
                              <label class="sr-only">Email</label>
                              <input type="search" class="form-control-plaintext" placeholder="Search..">
                              <span class="d-sm-none mobile-search">
                              </span>
                          </div>
                      </form>
                  </li> */}
                            {/* <li>
                                <a href="#!" className="text-dark">
                                    <img
                                        className="align-self-center pull-right me-2"
                                        src="/assets/dashboard_uni/browser.png"
                                        alt="header-browser"
                                    />
                                </a>
                            </li> */}
                            {/* <li className="onhover-dropdown">
                                <div className="d-flex align-items-center">
                                    <img
                                        className="align-self-center pull-right flex-shrink-0 me-2"
                                        src="/assets/dashboard_uni/user.png"
                                        alt="header-user"
                                    />
                                    <div>
                                        <h6 className="m-0 txt-dark f-16">
                                            My Account
                                            <i className="fa fa-angle-down pull-right ms-2" />
                                        </h6>
                                    </div>
                                </div>
                                <ul className="profile-dropdown onhover-show-div p-20">
                                    <li>
                                        <a href="#">
                                            <i className="icon-user" />
                                            Edit Profile
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#">
                                            <i className="icon-power-off" />
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </li> */}
                        </ul>
                        {/* <div className="d-lg-none mobile-toggle">
                            <i className="icon-more" />
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TopHeader;
