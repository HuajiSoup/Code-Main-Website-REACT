"use client";

import React, { useLayoutEffect, useState } from "react";

import { randElem } from "@/utils/math";

const texts = [
    "真是滑天下之大稽！",
    "滑稽，是一种态度。",
    "滑而不稽则罔，稽而不滑则殆。",
    "稽你太美。",
    "滑稽是人类进步的阶梯。",
    "我要成为大稽霸！"
];

const Huajireka: React.FC = () => {
    const [quote, setQuote] = useState(texts[0]);

    useLayoutEffect(() => {
        setQuote(randElem(texts));
    }, []);
  
    return (
        <div className="huajireka-wrapper">
            <div className="huajireka-photo"></div>
            <div className="huajireka-text">
                <b>欢迎回来!</b>
                <p>{quote}</p>
            </div>
        </div>
    );
};

export default Huajireka;