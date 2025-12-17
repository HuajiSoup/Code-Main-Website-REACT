import React from "react";
import { Link } from "react-router-dom";

import { pageInfo } from "src/constants/pages";

const PortalBtn: React.FC<pageInfo> = (props) => {
    return (
        <Link to={props.href}>
            <div className="portal">
                <img src={props.icon} alt="" className="portal-icon" />
                <p><b>{props.title}</b></p>
            </div>
        </Link>
    );
};

export default PortalBtn;