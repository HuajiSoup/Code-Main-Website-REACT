import React from "react";

import { ToyInfo } from ".";

const ToyCard: React.FC<{toy: ToyInfo}> = ({ toy }) => {
    return (<>
        <div className="toy-card-wrapper">
            <div className="toy-card">
                <a href={`/toys/${toy.slug}/`}>
                    <div className="toy-card-title-wrapper">
                        <div className="toy-card-cover" style={{
                            backgroundImage: `url(/toys/${toy.slug}/${toy.icon})`
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