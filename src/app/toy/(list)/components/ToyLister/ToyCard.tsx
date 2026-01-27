import React from "react";

import Link from "next/link";
import { ToyData } from "../../page";

const ToyCard: React.FC<{toy: ToyData}> = ({ toy }) => {
    return (<>
        <div className="toy-card-wrapper">
            <div className="toy-card">
                <Link href={toy.url} target="_blank" rel="noreferrer">
                    <div className="toy-card-title-wrapper">
                        <div className="toy-card-cover" style={{
                            backgroundImage: `url(${toy.icon})`
                        }}></div>
                        <h2 className="toy-card-title">{toy.title}</h2>
                    </div>
                </Link>

                <hr />
                
                <div className="toy-card-desc">
                    <p>{toy.desc}</p>
                </div>
            </div>
        </div>
    </>);
}

export default ToyCard;