import svgHome from "../assets/menu/icon-home.svg";
import svgPaper from "../assets/menu/icon-newspaper.svg";
import svgHammer from "../assets/menu/icon-hammer.svg";

export type pageInfo = {
    title: string;
    icon: string;
    href: string;
}

export const mainPages: pageInfo[] = [
    {
        title: "主站",
        icon: svgHome,
        href: "/",
    },
    {
        title: "博客",
        icon: svgPaper,
        href: "/blog",
    },
    {
        title: "玩具",
        icon: svgHammer,
        href: "/toy",
    }
];