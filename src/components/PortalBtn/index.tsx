import React from "react";
import Link from "next/link";

import { PageInfo } from "@/constants/pages";

type PortalBtnProps = PageInfo & React.ComponentPropsWithoutRef<"div">;

const PortalBtn: React.FC<PortalBtnProps> = (props) => {
    const {
        title,
        icon: Icon,
        href,
        ...divProps
    } = props;

    return (
        <Link href={href}>
            <div className="portal" {...divProps}>
                <Icon className="portal-icon" />
                <p><b>{title}</b></p>
            </div>
        </Link>
    );
};

export default PortalBtn;