"use client";

import { Code2 } from "lucide-react";
import React, { useState } from "react";

type CodeShowerProps = {
    lang?: string;
    children: React.ReactNode;
};

const CodeShower: React.FC<CodeShowerProps> = ({ lang, children }) => {
    const [open, setOpen] = useState<boolean>(true);

    const toggle = () => {setOpen(!open);}

    return (<>
        <div className="code-lang-tag" onClick={toggle}>
            <Code2 className="code-lang-icon" />
            {lang ?? "代码"}
        </div>
        {open && <code>{children}</code>}
    </>);
};

export default CodeShower;