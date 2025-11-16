import React from "react";

import "./index.scss";

const Welcome: React.FC = () => {
    return (
        <div className="welcome-wrapper">
            <div className="title-box">
                <h1 className="main-title">HUAJI UNIVERSE</h1>
                <h1 className="main-title">RECREATED.</h1>
                <h1 className="main-title">稽之宇宙 用滑稽创造无限可能</h1>
                <p className="intro">
                    滑稽最早见于清代林嗣环《口技》:“伸颈，侧目，微笑，默叹，以为妙绝。” 
                    现在一般认为滑稽是古汉语的一部分，并在21世纪初达到鼎盛。在历代关于滑稽的文献中，其都具有深刻的内涵。<br />
                    面对21世纪初逐渐加速的社会经济和巨大的社会压力，当时的青年人把复杂的情感寄托在滑稽脸中，笑对人生。
                    虽然那个时代已经离我们很远，也没有任何当时的影像资料留存，但我们仍能感受到时代洪流下年轻人的乐观主义精神。
                </p>
            </div>
        </div>
    );
};

export default Welcome;