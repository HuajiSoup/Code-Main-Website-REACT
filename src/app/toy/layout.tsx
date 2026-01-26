import React from "react";
import Banner from "@/components/Banner";

import "./layout.scss";

export default function ToyPagesLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (<>
        <main id="toy-main">
            <Banner><b>稽之玩具</b></Banner>
            <div className="content-wrapper">
                {children}
            </div>
        </main>
    </>);
}