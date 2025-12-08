import React from "react";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Banner from "../../components/Banner";
import Blogger from "../../components/Blogger";

import "./index.scss";

const PageBlog: React.FC = () => {
    return (<>
        <Header />
        <main>
            <Banner title="稽之博客" />
            <div className="content-wrapper">
                <Blogger />
            </div>
        </main>
        <Footer />
    </>);
};

export default PageBlog;