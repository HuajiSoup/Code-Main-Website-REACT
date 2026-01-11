import React from "react";

import { ToyInfo } from ".";

const ToyCard: React.FC<{toy: ToyInfo}> = ({ toy }) => {
    return (<>
        <div className="toy-card-wrapper">
            <div className="toy-card">
                <a href={toy.url} target="_blank" rel="noreferrer">
                    <div className="toy-card-title-wrapper">
                        <div className="toy-card-cover" style={{
                            backgroundImage: `url(${toy.icon})`
                        }}></div>
                        <h2 className="toy-card-title">{toy.title}</h2>
                    </div>
                </a>
                <hr />
                <div className="toy-card-desc">
                    <p>{toy.desc}</p>
                </div>
            </div>
        </div>
    </>);
}

export default ToyCard;