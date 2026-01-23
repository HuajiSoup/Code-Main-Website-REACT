import React, { memo, useState } from "react";


type CodeShowerProps = {
    lang?: string;
    children: React.ReactNode;
};

const CodeShower: React.FC<CodeShowerProps> = memo(({ lang, children }) => {
    const [open, setOpen] = useState<boolean>(true);

    const toggle = () => {setOpen(!open);}

    return (<>
        <p className="code-lang-tag" onClick={toggle}>{lang ?? "代码"}</p>
        {open && <code>{children}</code>}
    </>);
});

export default CodeShower;