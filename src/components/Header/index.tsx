import React, { memo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { randElem } from "../../utils/math";

import logo from "../../assets/logo_text_header.png";
import svgHome from "../../assets/menu/icon-home.svg";
import svgPaper from "../../assets/menu/icon-newspaper.svg";

import "./index.scss";

type PortalContent = {
    title: string;
    icon: string;
    href: string;
}

const texts = [
    "滑稽，是一种态度。",
    "滑而不稽则罔，稽而不滑则殆。",
    "真是滑天下之大稽！",
    "稽你太美。",
    "滑稽是人类进步的阶梯。",
    "我要成为大稽霸！"
];

const portals: PortalContent[] = [
    {
        title: "主站",
        icon: svgHome,
        href: "/",
    },
    {
        title: "博客",
        icon: svgPaper,
        href: "/blog"
    }
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

const Portal: React.FC<PortalContent> = (props) => {
    return (
        <Link to={props.href}>
            <div className="portal">
                <img src={props.icon} alt="" className="portal-icon" />
                <p><b>{props.title}</b></p>
            </div>
        </Link>
    );
};

const Header: React.FC = memo(() => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggle = () => { setMenuOpen(!menuOpen) };

    return (
        <header>
            <div className="header-wrapper">
                <div
                    className="logo-toggle"
                    style={{ background: `url(${logo}) center / contain no-repeat` }}
                    onClick={toggle}
                ></div>
            </div>
            
            <div className={menuOpen ? "navi-menu open" : "navi-menu closed"} ref={menuRef}>
                <div className="navi-menu-wrapper">
                    <div className="navi-menu-exit" onClick={toggle}>← 返回</div>

                    <Huajireka />

                    <div className="portals-wrapper">
                        {portals.map((portal, index) => (
                            <Portal key={index} {...portal} />
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
});

export default Header;