import React from "react";
import "./index.scss";

import Header from "src/components/Header";
import Banner from "src/components/Banner";
import Footer from "src/components/Footer";
import Toyer from "src/components/Toyer";
import TitleSetter from "src/components/TitleSetter";

const PageToy: React.FC = () => {
    return (<>
        <TitleSetter title="稽之玩具 | Huaji Toys" />

        <Header/>
        <main id="toy-main">
            <Banner><b>稽之玩具</b></Banner>
            <div className="content-wrapper">
                <Toyer />
            </div>
        </main>
        <Footer/>
    </>)
}

export default PageToy;