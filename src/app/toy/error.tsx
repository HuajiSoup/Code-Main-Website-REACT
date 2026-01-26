"use client";

import "./layout.scss";

import { useEffect } from "react";

const ErrorBlogList = ({
    error,
    reset
}: {
    error: Error & {digest: string},
    reset: () => void,
}) => {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (<>
        <div className="toyer-error-root">
            <div className="toy-status-card error">
                <p>
                    🚫玩具列表加载失败！<br />
                    🚫Error.message: {error.message} <br />
                    🚫Error.digest: {error.digest} <br />
                </p>
                <button onClick={reset}>点击重试</button>
            </div>
        </div>
    </>);
}

export default ErrorBlogList;