import React from "react";
import "./index.scss";

import Footer from "src/components/Footer";
import Header from "src/components/Header";
import TitleSetter from "src/components/TitleSetter";

const PageError: React.FC = () => {
    return (<>
        <TitleSetter title="稽之错误 | Huaji Error" />

        <Header />
        <main id="error-main">
            <h2>不滑稽的页面！</h2>
            <h3>——稽之宇宙不存在此页面</h3>
            <hr />
            <p>
                请您仔细检查网址是否有错误！<br />
                这也许不是您的问题，此站点刚刚进行了一次较大的改动，具体为：
            </p>
            <ul>
                <li><code>/pages/download</code> 和 <code>/pages/lab</code> 页面已经被移除或仍在重建中</li>
                <li><code>/pages/things/[name].html</code> 已经被移动至 <code>/toy/[name]</code></li>
            </ul>
        </main>
        <Footer />
    </>);
}

export default PageError;