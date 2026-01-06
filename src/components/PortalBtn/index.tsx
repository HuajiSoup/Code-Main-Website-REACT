import React from "react";
import { Link } from "react-router-dom";

import { PageInfo } from "src/constants/pages";

type PortalBtnProps = PageInfo & React.ComponentPropsWithoutRef<"div">;

const PortalBtn: React.FC<PortalBtnProps> = (props) => {
    const {
        title,
        icon,
        href,
        ...divProps
    } = props;

    return (
        <Link to={href}>
            <div className="portal" {...divProps}>
                <img src={icon} alt="" className="portal-icon" />
                <p><b>{title}</b></p>
            </div>
        </Link>
    );
};

export default PortalBtn;