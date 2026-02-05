import { Home, Newspaper, Hammer, LucideProps } from "lucide-react";

export type PageInfo = {
    title: string;
    icon: React.ComponentType<LucideProps>;
    href: string;
}

export const mainPages: PageInfo[] = [
    {
        title: "主站",
        icon: Home,
        href: "/",
    },
    {
        title: "博客",
        icon: Newspaper,
        href: "/blog",
    },
    {
        title: "玩具",
        icon: Hammer,
        href: "/toy",
    }
];