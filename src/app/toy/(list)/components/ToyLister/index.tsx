"use client"

import React, { useEffect, useState } from "react";
import "./index.scss";

import { ToyData } from "../../page";
import ToyCard from "./ToyCard";
import SearchBar from "@/components/SearchBar";

type ToyListerProps = {
    toys: ToyData[]
}

const ToyLister: React.FC<ToyListerProps> = ({ toys }) => {
    const [search, setSearch] = useState<string>("");
    const [showToys, setShowToys] = useState<ToyData[]>(toys);

    useEffect(() => {
        if (search === "") {
            setShowToys(toys);
            return;
        }

        const terms = search.split(" ").filter(term => term);
        setShowToys(toys.filter(toy => {
            for (const term of terms) {
                if (toy.title.indexOf(term) !== -1
                    || toy.desc.indexOf(term) !== -1
                ) return true;
            }
            return false;
        }));
    }, [search, toys]);

    return (<>
        <div className="toyer-root">
            <div className="toyer-wrapper">
                <div className="toys-search-wrapper">
                    <SearchBar setTermCallback={setSearch} changeInterval={250} />
                </div>
                <div className="toys-list">
                    {showToys.map((toy, index) => <ToyCard toy={toy} key={index} /> )}
                </div>
            </div>
        </div>
    </>);
}

export default ToyLister;