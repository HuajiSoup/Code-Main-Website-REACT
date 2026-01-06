import React, { JSX, useEffect } from "react";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Welcome from "./components/Welcome";
import SectionList from "./components/SectionList";
import Menu from "./components/Menu";

import img1 from "./assets/bg-newyear.jpg";
import img2 from "./assets/bg-mc.jpg";
import img3 from "./assets/bg-mountain.jpg";
import img4 from "./assets/bg-aurora.jpg";

import './index.scss';

type SectionContent = {
    title: string,
    content: JSX.Element[],
    color: string,
    img: string,
    id: number,
}

const sections = [
    {
        id: 0,
        title: "稽 之传承",
        content: [
            (<p>
                <i>“伸颈，侧目，微笑，默叹，以为妙绝。”</i><br />
                今天学者一般认为滑稽是古汉语的一部分，并在21世纪初达到鼎盛。<br />
                面对21世纪初不断增大的社会压力，当时的青年人无法改变现状，只好把复杂的情感寄托在滑稽脸中，笑对人生。<br />
                虽然那个时代已经离我们很远，也没有任何当时的影像资料留存，但我们仍能感受到时代洪流下年轻人的乐观主义精神。
            </p>),
            (<p>
                滑稽风光也许不再，但滑稽精神永存！<br />
                今天，稽之宇宙(Huaji Universe Co,.Ltd.)堂堂成立！<br />
                我们有充足的信心向您保证——<br />
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
    {
        id: 2,
        title: "稽 之先驱",
        content: [
            (<p>
                高速的时代，一切以速度为王。
                如今，一人一台电脑已经不稀奇，一人一个滑稽的时代来临力！（喜 <br />
                稽之宇宙以<b>超低价格、超强功能、超酷外形</b>劲爆出击，
                我们为你提供最新的<b>美国大片</b>与<b>滑稽资讯</b>。<br />
                停！可以放大再放大，看！每一根毛都看的清清楚楚！<br />
            </p>),
            (<p>
                稽之宇宙的滑稽资讯有特殊的发布技巧，我们会假装四处看风景，然后马上就到你家门口。<br />
                最新最热的滑稽新闻速报，让您第一时间了解最新最热的滑稽新闻，让您站在滑稽生态最前线！<br />
                很好与优秀，只差一点点距离，这段距离叫<b>滑稽</b>。
            </p>)
        ],
        color: "#555555",
        img: img3,
    },
    {
        id: 3,
        title: "稽 之憧憬",
        content: [
            (<p>
                稽之宇宙的野心绝不仅仅是稽化中文互联网。<br />
                滑稽从来不是一个单调的表情包，滑稽有精神，滑稽有格调<sup>?</sup>，稽之宇宙的目的是——
                <b>稽化全宇宙</b>！进而成为具象化的真正的“稽之宇宙”。<br />
                在这个宇宙中，不再有饥荒、不再有战火、不再有不平等、不再有不和谐，农业不发达都会互相支援的
                <b>滑稽乌托邦</b>！
            </p>),
            (<p>
                我们深知这并非一日之功，因此正如一句古语所言：<em>我们遇到什么困难也不要怕，微笑着面对它！
                消除恐惧的最好办法就是面对恐惧！</em><br />
                今天，滑稽的接力棒已然落在我们手中，不要停下来啊！只要我们不停下来，道路就会不断延伸！
            </p>)
        ],
        color: "#413399",
        img: img4,
    }
]

const PageIndex: React.FC = () => {
    useEffect(() => {
        document.title = "稽之宇宙 | Huaji Universe";
    }, []);

    return (<>
        <Header />
        <main id="main-index">
            <div className="background" id="backlogo"></div>
            <div className="index-wrapper">
                <Welcome />
                <SectionList content={sections} />
                <Menu />
            </div>
        </main>
        <Footer />
    </>);
};

export type { SectionContent };
export default PageIndex;