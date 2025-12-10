import React, { useState } from "react";
import { transform } from "motion";

import { rand, randElem } from "../../utils/math";

import "./index.scss";

type PageTitleProps = {
    title: string;
}

const TREE_TEXTURES = ["🌲", "🌳", "🌴"];
const PLANT_TEXTURES = [
    "🍊","🍎","🍇","🍈","🍏",
    "🌽","🍓","🍒","🍄","🌸",
    "🏵️","🌹","🌺","🌻","🌼",
    "🌷",
];

type Cloud = {
    x: number;
    y: number;
    scale: number;
    animateTime: number;
}
type Tree = {
    x: number;
    y: number;
    scale: number;
    texture: string;
    animateTime: number;
}
type Plant = {
    x: number;
    y: number;
    scale: number;
    texture: string;
}
type Sky = {
    sunrise: number;
    color: string;
}
type Scene = {
    clouds: Cloud[];
    trees: Tree[];
    plants: Plant[];
    sky: Sky;
}

const Banner: React.FC<PageTitleProps> = ({ title }) => {
    function spawnScene(): Scene {
        let clouds: Cloud[] = [];
        let trees: Tree[] = [];
        let plants: Plant[] = [];
    
        while (clouds.length < 5 || Math.random() < 0.3) {
            clouds.push({
                x: rand(0, 80),
                y: rand(-20, 20),
                scale: rand(0.8, 2),
                animateTime: rand(20, 35),
            });
        }
        while (trees.length < 5 || Math.random() < 0.5) {
            trees.push({
                x: rand(-10, 5),
                y: rand(-5, 0),
                scale: rand(0.9, 1.5),
                texture: randElem(TREE_TEXTURES),
                animateTime: rand(3.5, 6),
            });
        }
        while (plants.length < 10 || Math.random() < 0.6) {
            plants.push({
                x: rand(10, 75),
                y: rand(-5, 20),
                scale: rand(0.9, 1.2),
                texture: randElem(PLANT_TEXTURES),
            });
        }

        const date = new Date();
        const progress = date.getHours() / 24 + date.getMinutes() / 1440;
        // const progress = Math.random();
        
        let sky: Sky = {
            sunrise: transform(progress, 
                [0, 0.5, 1],
                [0, -100, 0],
            ),
            color: transform(progress,
                [0, 1/8, 2/8, 3/8, 4/8, 5/8, 6/8, 7/8],
                ["#172549","#cc8e81","#f0ca90","#87cefa","#4b96ea","#ee7f22","#a86771","#172549"]
            ),
        };

        return { clouds, trees, plants, sky };
    }

    const [scene, setScene] = useState<Scene>(spawnScene());

    return (<>
        <div className="banner"
            style={{
                backgroundColor: scene.sky.color,
            }}
        >
            <div className="banner-scene">
                <div className="huaji-sun" 
                    onClick={() => setScene(spawnScene())}
                    style={{
                        translate: `0 ${scene.sky.sunrise}px`,
                    }}
                ></div>

                <div className="layer-land">
                    <div className="land-back"></div>
                    <div className="land-fore"></div>
                </div>
                <div className="layer-cloud">
                    {scene.clouds.map((c, i) => (
                        <div className="cloud"
                            key={i}
                            style={{
                                left: `${c.x}%`,
                                top: `${c.y}%`,
                                scale: c.scale,
                                animationDuration: `${c.animateTime}s`,
                            }}
                        >☁️</div>
                    ))}
                </div>
                <div className="layer-plant">
                    {scene.plants.map((p, i) => (
                        <div className="plant"
                            key={i}
                            style={{
                                left: `${p.x}%`,
                                bottom: `${p.y}%`,
                                scale: p.scale,
                            }}
                        >{p.texture}</div>
                    ))}
                </div>
                <div className="layer-tree">
                    {scene.trees.map((t, i) => (
                        <div className="tree"
                            key={i}
                            style={{
                                left: `${t.x}%`,
                                bottom: `${t.y}%`,
                                scale: t.scale,
                                animationDuration: `${t.animateTime}s`,
                            }}
                        >{t.texture}</div>
                    ))}
                </div>
                <div className="sky-mask"
                    style={{
                        backgroundColor: scene.sky.color,
                    }}
                ></div>
            </div>
            <div className="banner-text">
                <h1>{title}</h1>
            </div>
        </div>
    </>);
};

export default Banner;