import React, { useEffect } from "react";

import Welcome from "./components/Welcome";
import Section from "./components/Section";

import './index.scss';
import img1 from "./components/Welcome/assets/bg-hu-newyear.jpg";

const sectionContent = [
    {
        title: "稽 之乐园",
        content: [
            (<p>
                稽之宇宙(Huaji Universe Co,.Ltd.) <br/>
                是一家国内的内地专业业余公司，<br/>
                我们将坚持<b>滑天下之大稽</b>的外交原则<br/>
                和<b>净整没用的</b>的办事准则，<br/>
                努力创建滑稽型公司环境。<br />
                <b>滑稽，我们是专业的。</b><br />
            </p>),
        ],
        color: "#ffaa00",
        img: img1,
    }
]

const Index: React.FC = () => {
    useEffect(() => {
        document.title = "稽之宇宙 | Huaji Universe";
    }, []);

    return (
        <div className="index-wrapper">
            <Welcome></Welcome>
            <div className="sections-wrapper">
                {sectionContent.map((section, index) => 
                    <Section key={index} {...section}></Section>
                )}
            </div>
        </div>
    );
};

export default Index;