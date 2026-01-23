import React, { memo } from "react";
import "katex/dist/katex.min.css";
import "prismjs/themes/prism-tomorrow.min.css";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import CodeShower from "./CodeShower";
import rehypePrism from "rehype-prism-plus";

type MyMarkdownProps = {
    children: string;
}

const MyMarkdown: React.FC<MyMarkdownProps> = memo(({ children }) => {
    return <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypePrism]}
        components={{
            code: ({node, className, ...props}) => {
                const isBlock = !!className;
                if (isBlock) {
                    const hasLang = className.indexOf("language-");
                    if (hasLang >= 0) {
                        const lang = className.split("language-")[1].split(" ")[0];
                        return <CodeShower lang={lang}>{props.children}</CodeShower>
                    }
                    return <CodeShower>{props.children}</CodeShower>
                }

                return (<code>{props.children}</code>);
            }
        }}
    >{children}</ReactMarkdown>
})

export default MyMarkdown;