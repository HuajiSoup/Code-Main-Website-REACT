import React, { memo } from "react";
import "katex/dist/katex.min.css";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import CodeShower from "./CodeShower";

type MyMarkdownProps = {
    children: string;
}

const MyMarkdown: React.FC<MyMarkdownProps> = memo(({ children }) => {
    return <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
            code: ({node, className, ...props}) => {
                const isBlock = !!className;
                if (isBlock) {
                    const lang = className.split("-")[1];
                    return <CodeShower lang={lang}>{props.children}</CodeShower>
                }

                return (<code>{props.children}</code>);
            }
        }}
    >{children}</ReactMarkdown>
})

export default MyMarkdown;