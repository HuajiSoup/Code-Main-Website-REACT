import React from "react";

type SpaceHolderProps = {
    width? :string | number,
    height? :string | number,
}

const SpaceHolder: React.FC<SpaceHolderProps> = (props) => {
    const width = props.width??0 + (typeof props.width == "number" ? "px" : "");
    const height = props.height??0 + (typeof props.height == "number" ? "px" : "");
    return (
        <div
            style={{
                display: "block",
                width: `${width}`,
                height: `${height}`
            }}
        ></div>
    );
};

export default SpaceHolder;