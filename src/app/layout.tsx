import React from "react";
// import { ? } from "next/font/google";

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
                <LazyMotion features={domAnimation} strict>
                    <Header />
                    {children}
                    <Footer />
                </LazyMotion>
            </body>
        </html>
    </>);
}