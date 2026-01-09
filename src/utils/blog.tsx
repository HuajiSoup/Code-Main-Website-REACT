import { storageBlogsUrl } from "src/constants/storage";

export type BlogInfo = {
    title: string | null;
    blogID: string | null;
    emoji: string | null;
    cover: string | null;
    desc: string | null;
    section: string;
    tags: string[];
    lastEdit: string | null;
}

// Notion (removed)
// export function postToBlogInfo(post: any): BlogInfo {
//     const date = new Date(post.properties?.time?.last_edited_time ?? "0");

//     return {
//         title: post.properties?.title?.title[0]?.plain_text,
//         blogID: String(post.properties?.id?.number) ?? "",
//         emoji: post.icon?.emoji,
//         cover: post.cover?.file?.url,
//         desc: post.properties?.desc?.rich_text[0]?.plain_text,
//         section: post.properties?.section?.select?.name,
//         tags: post.properties?.tags.multi_select?.map((tag: { name: string; }) => tag.name) ?? [],
//         lastEdit: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
//     }
// }

// AliyunOSS
export function postToBlogInfo(meta: any): BlogInfo {
    const date = new Date(Number(meta.lastEdit ?? 0));

    return {
        title: meta.title,
        blogID: meta.blogID,
        emoji: meta.emoji,
        cover: `${storageBlogsUrl}/blog-${meta.blogID}/${meta.cover}`,
        desc: meta.desc,
        section: meta.section,
        tags: meta.tags,
        lastEdit: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDay()}`,
    }
}