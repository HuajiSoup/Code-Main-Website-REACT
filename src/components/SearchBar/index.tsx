import React, { forwardRef, SetStateAction, useImperativeHandle, useRef } from "react";
import "./index.scss";

import { debounce } from "src/utils/timer";

type SearchBarProps = {
    setTermCallback?: React.Dispatch<SetStateAction<string>>;
    changeInterval?: number;
    placeholder?: string;
}

type SearchBarHandle = {
    setInput: (v: string) => void;
}

const SearchBar = forwardRef<SearchBarHandle, SearchBarProps>((props, ref) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    // prop back search term
    const setTerm = props.setTermCallback;
    const setTermDb = setTerm ? debounce(() => {
        setTerm(inputRef.current?.value ?? "");
    }, props.changeInterval ?? 500) : () => {};

    // edit search term
    useImperativeHandle(ref ?? null, () => ({
        setInput: (v: string) => {
            if (inputRef.current) inputRef.current.value = v;
            setTerm?.(v);
        },
    }));

    return (<>
        <form className="search-bar">
            <input type="text" name="search-bar"
                ref={inputRef}
                placeholder={props.placeholder ?? "搜索..."}
                onInput={setTermDb}
            />
        </form>
    </>);
});

export type { SearchBarHandle };
export default SearchBar;