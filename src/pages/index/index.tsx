import React, { useEffect } from "react";

import Welcome from "./components/Welcome";
import SectionList from "./components/SectionList";
import Header from "@/components/Header";

import img1 from "./assets/bg-newyear.jpg";
import img2 from "./assets/bg-mc.jpg";

import './index.scss';

const sectionContent = [
    {
        id: 0,
        title: "稽 之传承",
        content: [
            (<p>
                “伸颈，侧目，微笑，默叹，以为妙绝。” <br />
                这是清代名作《口技》中的内容，也是对滑稽的最早记载。
                现在一般认为滑稽是古汉语的一部分，并在21世纪初达到鼎盛。<br />
                面对21世纪初逐渐加速的社会经济和巨大的社会压力，当时的青年人无法改变现状，只好把复杂的情感寄托在滑稽脸中，笑对人生。<br />
                虽然那个时代已经离我们很远，也没有任何当时的影像资料留存，但我们仍能感受到时代洪流下年轻人的乐观主义精神。
            </p>),
            (<p>
                滑稽风光也许不再，但滑稽精神永存！<br />
                今天，稽之宇宙(Huaji Universe Co,.Ltd.)堂堂成立！<br />
                我们是一家国内的内地专业业余公司，<br/>
                将坚持<b>滑天下之大稽</b>的办事准则<br/>
                努力创建滑稽型公司环境。<br />
                <b>滑稽，我们是专业的。</b><br />
            </p>),
        ],
        color: "#ffaa00",
        img: img1,
    },
    {
        id: 1,
        title: "稽 之发扬",
        content: [
            (<p>
                时代纷繁复杂，文化多元多变，<br />
                我们深知：在如今的市场环境中，做不到，就艾草！<br />
                因此在工作中，我们始终秉持<b>逸一时，误一世</b>的紧迫观念，一刻不敢懈怠地创飞！<br />
                世界表情都涨价，表情掺了稽坷垃，小埋亩产一千八！！<br />
            </p>),
            (<p>
                紧跟时事，稽之宇宙公司将业务拓展到程序设计、ACG、户外运动...致力于让产品与现实生活相互结合、发挥作用。<br />
                我们思想开放，海纳百川，目标是让不玩贴吧<sup>?</sup>的普通人也能领悟滑稽的真谛！<br />
                同时我们更加号召与阴险、喷水、愤怒等表情携手共进，构成贴吧表情共荣联盟。<del>真是一些苦命鸳鸯啊</del>
            </p>),
        ],
        color: "#008800",
        img: img2,
    },
]

const Index: React.FC = () => {
    useEffect(() => {
        document.title = "稽之宇宙 | Huaji Universe";
    }, []);

    return (
        <>  
            <header>
                <Header />
            </header>
            <main>
                <div className="background" id="backlogo"></div>
                <div className="index-wrapper">
                    <Welcome></Welcome>
                    <SectionList content={sectionContent}></SectionList>
                </div>
            </main>
        </>
    );
};

export default Index;