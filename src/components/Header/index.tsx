import React, { memo, useRef, useState } from "react";
import "./index.scss";

import PortalBtn from "../PortalBtn";
import { randElem } from "../../utils/math";

import { mainPages } from "src/constants/pages";

import logo from "../../assets/logo_text_header.png";

const texts = [
    "滑稽，是一种态度。",
    "滑而不稽则罔，稽而不滑则殆。",
    "真是滑天下之大稽！",
    "稽你太美。",
    "滑稽是人类进步的阶梯。",
    "我要成为大稽霸！"
];

const Huajireka: React.FC = memo(() => {
    return (<>
        <div className="huajireka-wrapper">
            <div className="huajireka-photo"></div>
            <div className="huajireka-text">
                <b>欢迎回来!</b>
                <p>{randElem(texts)}</p>
            </div>
        </div>
    </>);
});

const Header: React.FC = memo(() => {
    const [firstOpen, setFirstOpen] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggle = () => {
        if (!menuOpen && !firstOpen) setFirstOpen(true);
        setMenuOpen(!menuOpen);
    }

    return (
        <header>
            <div className="header-wrapper">
                <div
                    className="logo-toggle"
                    style={{ background: `url(${logo}) center / contain no-repeat` }}
                    onClick={toggle}
                ></div>
            </div>
            
            <div className={menuOpen ? "navi-menu open" : "navi-menu closed"}>
                <div className="navi-menu-sidebar" ref={menuRef}>
                    <div className="navi-menu-sidebar-wrapper">
                        <div className="navi-menu-sidebar-exit" onClick={toggle}>← 返回</div>

                        <Huajireka />

                        {firstOpen && <div className="portals-wrapper">
                            {mainPages.map((page, index) => (
                                <PortalBtn key={index} {...page} style={{
                                    animationDelay: `${index * 40}ms`,
                                }} />
                            ))}
                        </div>}
                    </div>
                </div>
                <div className="navi-menu-backdrop" onClick={toggle}></div>
            </div>
        </header>
    );
});

export default Header;