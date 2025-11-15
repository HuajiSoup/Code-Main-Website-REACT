import React, { useEffect } from "react";
import './index.scss';

import Welcome from "./components/Welcome";

const Index: React.FC = () => {
    useEffect(() => {
        document.title = "稽之宇宙 | Huaji Universe";
    }, []);

    return (
        <Welcome></Welcome>
    );
};

export default Index;