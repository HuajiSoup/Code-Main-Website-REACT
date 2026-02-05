"use client";

import React, { useState } from "react";
import "./index.scss";

import PortalBtn from "../PortalBtn";
import Huajireka from "./Huajireka";

import { mainPages } from "@/constants/pages";
import { ArrowLeft } from "lucide-react";

const Header: React.FC = () => {
    const [firstOpen, setFirstOpen] = useState<boolean>(false);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);

    const toggle = () => {
        if (!menuOpen && !firstOpen) setFirstOpen(true);
        setMenuOpen(!menuOpen);
    }

    return (
        <header>
            <div className="header-wrapper">
                <div
                    className="logo-toggle"
                    onClick={toggle}
                ></div>
            </div>
            
            <div className={menuOpen ? "navi-menu open" : "navi-menu closed"}>
                <div className="navi-menu-sidebar">
                    <div className="navi-menu-sidebar-wrapper">
                        <div className="navi-menu-sidebar-exit" onClick={toggle}>
                            <ArrowLeft className="lucide-icon" />
                            返回
                        </div>

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
};

export default Header;