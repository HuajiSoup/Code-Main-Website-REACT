"use client"

import React, { useMemo, useState } from "react";
import "./index.scss";

import { ToyData } from "../../page";
import ToyCard from "./ToyCard";
import SearchBar from "@/components/SearchBar";
import AnimatedDiv from "@/components/AnimatedDiv";
import { stagger, Variants } from "motion/react";

const animationToyList: Variants = {
    hidden: {},
    visible: {
        transition: {
            delayChildren: stagger(0.05, { ease: "easeOut" }),
        }
    }
};

type ToyListerProps = {
    toys: ToyData[]
}

const ToyLister: React.FC<ToyListerProps> = ({ toys }) => {
    const [search, setSearch] = useState<string>("");
    
    const showToys = useMemo(() => {
        const query = search.trim().toUpperCase();
        if (!query) return toys;
        
        const terms = query.split(" ").filter(term => term);
        return toys.filter(toy => {
            for (const term of terms) {
                if (toy.title.toUpperCase().indexOf(term) !== -1
                    || toy.desc.toUpperCase().indexOf(term) !== -1
                ) return true;
            }
            return false;
        });
    }, [toys, search]);

    return (<>
        <div className="toyer-root">
            <div className="toyer-wrapper">
                <div className="toys-search-wrapper">
                    <SearchBar setTermCallback={setSearch} changeInterval={250} />
                </div>
                <AnimatedDiv
                    className="toys-list"
                    key={search || "all"}
                    variants={animationToyList}
                >
                    { showToys.length
                        ? showToys.map((toy) => <ToyCard toy={toy} key={toy.slug} />)
                        : <div className="toy-status-card loading">没有找到“{search}”相关的玩具喵</div>
                    }
                </AnimatedDiv>
            </div>
        </div>
    </>);
}

export default ToyLister;