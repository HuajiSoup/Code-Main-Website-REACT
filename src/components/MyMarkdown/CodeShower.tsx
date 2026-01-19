import React, { memo, useState } from "react";

type CodeShowerProps = {
    lang: string;
    children: React.ReactNode;
};

const CodeShower: React.FC<CodeShowerProps> = memo(({ lang, children }) => {
    const [open, setOpen] = useState<boolean>(true);

    const content = children?.toString();
    const line = content?.split('\n').length ?? 0;
    let lineTags = [];
    for (let i = 0; i < line-1; i++) {
        lineTags.push(<p className="code-body-line-tag" key={i+1}>{i+1}</p>);
    }

    const toggle = () => {setOpen(!open);}

    return <>
        <p className="code-lang-tag" onClick={toggle}>{lang}</p>
        {open && <div className="code-body">
            <div className="code-body-line">{lineTags}</div>
            <code>{content}</code>
        </div>}
    </>;
});

export default CodeShower;