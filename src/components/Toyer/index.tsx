import React, { useEffect, useState } from "react";
import "./index.scss";

import SearchBar from "../SearchBar";
import ToyCard from "./ToyCard";

import { storageToysUrl } from "src/constants/storage";

type ToyInfo = {
    title: string;
    desc: string;
    url: string;
    icon?: string;
}

const metaToToyInfo = (meta: any): ToyInfo => {
    return ({
        title: meta.title,
        desc: meta.desc,
        url: `${storageToysUrl}/${meta.slug}`,
        icon: `${storageToysUrl}/${meta.slug}/${meta.icon}`,
    });
}

const Toyer: React.FC = () => {
    const [toys, setToys] = useState<ToyInfo[]>([]);
    const [showToys, setShowToys] = useState<ToyInfo[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("")

    const [search, setSearch] = useState<string>("");

    // fetch
    useEffect(() => {
        const fetchToys = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/toylist");
                const metadatas: any[] = await res.json();
                const toys = metadatas.map(metaToToyInfo);
                setToys(toys);
                setShowToys(toys);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        }
        fetchToys();
    }, []);

    // search
    useEffect(() => {
        if (search === "") {
            setShowToys(toys);
            return;
        }

        const terms = search.split(" ");
        setShowToys(toys.filter(toy => {
            for (const term of terms) {
                if (!term) continue;
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
                { loading && <div className="toy-status-card loading">▶️玩具绝赞加载中...</div> }
                { (!loading && error) && <div className="toy-status-card error">🚫玩具列表加载失败！{error}</div> }
                { (!loading && !error && showToys.length !== 0) &&
                    <div className="toys-list">
                        { showToys.map((toy, index) => (
                            <ToyCard toy={toy} key={index} />
                        )) }
                    </div>
                }
                { (!loading && !error && showToys.length === 0) && 
                    <div className="toy-status-card error">🔍未搜索到匹配“{search}”的结果！</div>
                }
            </div>
        </div>
    </>);
}

export default Toyer;
export type { ToyInfo };