import React from "react";

import "./index.scss";

const Footer: React.FC = () => {
    return (
        <footer>
            <div className="footer-contact-wrapper">
                <p>/ 联系我们 /</p>
                <div className="contact-list"></div>
            </div>
        </footer>
    );
}

export default Footer;