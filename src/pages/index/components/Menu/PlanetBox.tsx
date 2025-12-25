import React from "react";

import { PlanetInfo } from ".";
import { Link } from "react-router-dom";

type PlanetProps = {
    planet: PlanetInfo;
}

const BallBox: React.FC<PlanetProps> = ({ planet }) => {
    return (<>
        <div
            className="planet-ball"
            style={{
                backgroundColor: planet.color,
                boxShadow: `0px 0px 15px ${planet.color}`,
                backgroundImage: `url(${planet.icon})`,
                animationDelay: `${0.3 + 0.4 * planet.id}s`,
            }}
        ></div>
    </>);
}

const Planet: React.FC<PlanetProps> = ({ planet }) => {
    const onLeft = (planet.pos.x < 0.5);
    const styleDiv = onLeft ? {
        left: `${planet.pos.x * 100 - 4}vw`,
        top: `calc(${planet.pos.y * 100}vh - 4vw)`,
    } : {
        right: `${96 - planet.pos.x * 100}vw`,
        top: `calc(${planet.pos.y * 100}vh - 4vw)`,
    };
    
    return (<>
        <Link to={planet.href}>
            <div className={`planet ${onLeft ? "left" : "right"}`} style={styleDiv}>
                <BallBox planet={planet} />
                <div className="planet-text-wrapper-outer">
                    <div className="planet-text-wrapper">
                        <div className="planet-title"><h3>{planet.title}</h3></div>
                        <div className="planet-desc">{planet.desc}</div>
                    </div>
                </div>
            </div>
        </Link>
    </>);
};

type PlanetBoxProps = {
    planets: PlanetInfo[];
}

const PlanetBox: React.FC<PlanetBoxProps> = ({ planets }) => {
    return (<>
        <div className="menu-planets-wrapper">
            {planets.map((planet, index) => (
                <Planet planet={planet} key={index} />
            ))}
        </div>
    </>);
}

export default PlanetBox;