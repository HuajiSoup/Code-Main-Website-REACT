import React from "react";

import { LazyMotion, domAnimation } from "motion/react";

import Footer from "@/components/Footer";
import Header from "@/components/Header";

import "./global.scss";

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (<>
        <html>
            <body>
                <LazyMotion features={domAnimation}>
                    <Header />
                    {children}
                    <Footer />
                </LazyMotion>
            </body>
        </html>
    </>);
}