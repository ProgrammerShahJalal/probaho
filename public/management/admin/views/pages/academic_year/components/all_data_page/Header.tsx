import React from 'react';
import HeadSearch from './HeadSearch';
import HeadTitle from './HeadTitle';
import HeadRightButtons from './HeadRightButtons';
export interface Props {
    title?: string;
}

const Header: React.FC<Props> = (props: Props) => {
    return (
        <>
            <div className="action_bar px-2">
                <HeadTitle title={props.title}></HeadTitle>
                <div className="navigation">
                    <ul>
                        <li className="search_li">
                            <HeadSearch></HeadSearch>
                        </li>
                    </ul>
                </div>
                <div className="control">
                    <HeadRightButtons></HeadRightButtons>
                </div>
            </div>
        </>
    );
};

export default Header;
