"use client";

import React, { memo, SetStateAction, useEffect, useImperativeHandle, useRef } from "react";
import "./index.scss";

import { debounce } from "@/utils/timer";

type SearchBarProps = {
    setTermCallback?: React.Dispatch<SetStateAction<string>>;
    changeInterval?: number;
    placeholder?: string;
    ref?: React.RefObject<SearchBarHandle | null>;
}

type SearchBarHandle = {
    setInput: (v: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = memo((props) => {
    const {
        setTermCallback,
        changeInterval,
        placeholder,
        ref
    } = props;

    const inputRef = useRef<HTMLInputElement | null>(null);
    const updateTerm = useRef<() => void | null>(null);

    // prop back search term
    useEffect(() => {
        updateTerm.current = setTermCallback
         ? debounce(() => {
            setTermCallback(inputRef.current?.value ?? "");
         }, changeInterval ?? 500)
         : () => {};
    }, [setTermCallback, changeInterval]);

    // edit search term
    useImperativeHandle(ref, () => ({
        setInput: (v: string) => {
            if (inputRef.current) inputRef.current.value = v;
            setTermCallback?.(v);
        },
    }));

    return (<>
        <form className="search-bar">
            <input type="text" name="search-bar"
                ref={inputRef}
                onInput={() => {updateTerm.current?.()}}
                placeholder={placeholder ?? "搜索..."}
            />
        </form>
    </>);
});
SearchBar.displayName = "SearchBar";

export type { SearchBarHandle };
export default SearchBar;