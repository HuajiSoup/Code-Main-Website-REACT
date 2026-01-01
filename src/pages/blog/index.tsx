import React from "react";
import "./index.scss";

import { useParams } from "react-router-dom";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Banner from "../../components/Banner";
import Blogger from "../../components/Blogger";
import TitleSetter from "src/components/TitleSetter";


const PageBlog: React.FC = () => {
    const { blogID } = useParams() ?? {};

    return (<>
        <TitleSetter title="稽之博客 | Huaji Blogs" />

        <Header />
        <main id="blog-main">
            <Banner><b>稽之博客</b></Banner>
            <div className="content-wrapper">
                <Blogger blogID={blogID} />
            </div>
        </main>
        <Footer />
    </>);
};

export default PageBlog;