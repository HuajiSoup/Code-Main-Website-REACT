import React, { useEffect, useRef, useState } from "react";
import "./index.scss";

import logo from "@/assets/logo_text_header.png";

const Huajireka: React.FC = () => {
    return (<>
        <div className="huajireka-wrapper"></div>
    </>);
};

const Header: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggle = () => { setMenuOpen(!menuOpen) };

    return (
        <header>
            <div className="header-wrapper">
                <div
                    className="logo-toggle"
                    style={{ backgroundImage: `url(${logo})` }}
                    onClick={toggle}
                ></div>
            </div>
            
            <div className={menuOpen ? "navi-menu open" : "navi-menu closed"} ref={menuRef}>
                <div className="navi-menu-wrapper">
                    <div
                        className="navi-menu-exit"
                        onClick={toggle}
                    >← 返回</div>
                    <Huajireka />
                </div>
            </div>
        </header>
    );
};

export default Header;