/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import MenuDropDown from './MenuDropDown';
import MenuDropDownItem from './MenuDropDownItem';
import MenuSingle from './MenuSingle';
import ConfirmModal from '../../../components/ConfirmModal'; // Added import
export interface Props {}

const SideBar: React.FC<Props> = (props: Props) => {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Added state

    useEffect(() => {
        // Ensure jQuery is loaded before trying to use it, though in typical script setups it would be global.
        if ((window as any).jQuery) {
            init_nav_action();
            active_link(window.location.href);
        }

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            if ((window as any).jQuery) {
                (window as any).jQuery('.sidebar-menu').off('click', 'li a');
            }
        };
    }, []); 

    const handleLogout = () => {
        (document.getElementById('logout_form') as HTMLFormElement)?.submit();
    };

    return (
        <>
            <ul className="sidebar-menu">
                {/* Dashboard  */}
                <MenuSingle to="/" icon="icon-dashboard" label="Dashboard" />

                {/* Users  */}
                <MenuDropDown group_title="User" icon="icon-user">
                    <MenuDropDownItem label="All Users" to="/auth/users" />
                    {/* <MenuDropDownItem label="User Roles" to="/user-roles" /> */}
                    <MenuDropDownItem
                        label="User Login Histories"
                        to="/user-login-histories"
                    />
                </MenuDropDown>
                {/* Academic Management */}
                <MenuDropDown group_title="Academic" icon="icon-book">
                     <MenuDropDownItem label="Academic Year" to="/academic-year" />
                    <MenuDropDownItem label="Academic Batch ID Rules" to="/academic-batch-id-rules" />
                    <MenuDropDownItem
                        label="Acad. Calendar Event Types"
                        to="/academic-calendar-event-types"
                    />
                    <MenuDropDownItem label="Academic Calendar" to="/academic-calendar" />
                    <MenuDropDownItem
                        label="Academic Rules Types"
                        to="/academic-rules-types"
                    />
                    <MenuDropDownItem label="Academic Rules" to="/academic-rules" />
                    <MenuDropDownItem label="Branch Class Buildings" to="/branch-class-buildings" />
                    <MenuDropDownItem label="Branch Class Rooms" to="/branch-class-rooms" />
                    <MenuDropDownItem label="Branch Classes" to="/branch-classes" />
                </MenuDropDown>

                <li>
                    <a
                        className="sidebar-header"
                        href="#" // Prevent default navigation
                        onClick={(e) => {
                            e.preventDefault();
                            setIsLogoutModalOpen(true); // Open modal
                        }}
                    >
                        <i className="icon-lock"></i>
                        <span> Logout</span>
                    </a>
                </li>
            </ul>
            {/* Added ConfirmModal */}
            <ConfirmModal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                onConfirm={handleLogout}
                message="Are you sure you want to log out? Your session will be ended."
                title="Logout Confirmation"
            />
        </>
    );
};

function active_link(hash) {
    let url = new URL(hash);
    (window as any).jQuery(`.sidebar-submenu a`).removeClass('active');
    (window as any)
        .jQuery(`.sidebar-submenu a[href="${url.hash}"]`)
        .addClass('active');
    (window as any)
        .jQuery(`.sidebar-submenu a[href="${url.hash}"]`)
        .parent('li')
        .parent('ul')
        .css({ display: 'block' })
        .addClass('menu-open')
        .parent('li')
        .addClass('active');
}

function init_nav_action() {
    var animationSpeed = 300,
        subMenuSelector = '.sidebar-submenu';
    (window as any).jQuery('.sidebar-menu').on('click', 'li a', function (e) {
        var $this = (window as any).jQuery(this);
        var checkElement = $this.next();
        if (checkElement.is(subMenuSelector) && checkElement.is(':visible')) {
            checkElement.slideUp(animationSpeed, function () {
                checkElement.removeClass('menu-open');
            });
            checkElement.parent('li').removeClass('active');
        } else if (
            checkElement.is(subMenuSelector) &&
            !checkElement.is(':visible')
        ) {
            var parent = $this.parents('ul').first();
            var ul = parent.find('ul:visible').slideUp(animationSpeed);
            ul.removeClass('menu-open');
            var parent_li = $this.parent('li');
            checkElement.slideDown(animationSpeed, function () {
                checkElement.addClass('menu-open');
                parent.find('li.active').removeClass('active');
                parent_li.addClass('active');
            });
        }

        if (e.target && e.target.href && e.target.href.includes('http')) {
            active_link(e.target.href);
        }
    });
}

export default SideBar;
