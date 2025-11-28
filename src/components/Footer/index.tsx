import React from "react";

import iconGithub from "@/assets/links/link-github.png";
import iconBili   from "@/assets/links/link-bilibili.png";

import "./index.scss";

type ContactLinkProps = {
    url: string;
    icon: string;
}

const ContactLink: React.FC<ContactLinkProps> = (props) => {
    return (
        <a href={props.url} target="_blank" rel="noopener noreferrer">
            <div className="contact-icon"
                style={{background: `url(${props.icon}) center / cover no-repeat`}}></div>
        </a>
    )
};

const contact: ContactLinkProps[] = [
    {
        url: "https://github.com/HuajiSoup/",
        icon: iconGithub,
    },
    {
        url: "https://space.bilibili.com/284032791",
        icon: iconBili,
    }
];

const Footer: React.FC = () => {
    return (
        <footer>
            <div className="footer-contact-wrapper">
                <p>/ 联系我们 /</p>
                <div className="contact-list">
                    {contact.map((content, index) => (
                        <ContactLink key={index} {...content} />
                    ))}
                </div>
            </div>
        </footer>
    );
}

export default Footer;