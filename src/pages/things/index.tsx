import React from "react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PageTitle from "@/components/PageTitle";

const PageThings: React.FC = () => {
    return (<>
        <Header />
        <main>
            <PageTitle title="稽之玩具箱" />
            {}
        </main>
        <Footer />
    </>);
};

export default PageThings;