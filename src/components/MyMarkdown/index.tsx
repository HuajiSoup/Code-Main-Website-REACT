import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

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
                    return (<>
                        <p className="code-lang-tag">{lang}</p>
                        <code>{props.children}</code>
                    </>);
                }

                return (<code>{props.children}</code>);
            }
        }}
    >{children}</ReactMarkdown>
})

export default MyMarkdown;