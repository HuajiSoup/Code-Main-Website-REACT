import React from "react";

import { useParams } from "react-router-dom";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Banner from "../../components/Banner";
import Blogger from "../../components/Blogger";

import "./index.scss";

const PageBlog: React.FC = () => {
    const { blogID } = useParams() ?? {};

    return (<>
        <Header />
        <main>
            <Banner title="稽之博客" />
            <div className="content-wrapper">
                <Blogger blogID={blogID} />
            </div>
        </main>
        <Footer />
    </>);
};

export default PageBlog;