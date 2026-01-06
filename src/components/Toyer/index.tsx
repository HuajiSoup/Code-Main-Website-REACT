import React, { useEffect, useState } from "react";
import "./index.scss";

import SearchBar from "../SearchBar";
import ToyCard from "./ToyCard";

type ToyInfo = {
    title: string;
    desc: string;
    slug: string;
    icon?: string;
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
            if (toys.length) return;

            setLoading(true);
            try {
                const res = await fetch("/toys/common/toys.json");
                const data = await res.json();
                setToys(data.toys);
                setShowToys(data.toys);
            } catch (err) {
                console.error(err);
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        }
        fetchToys();
    }, [toys]);

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