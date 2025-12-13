export type BlogInfo = {
    title: string | null;
    pageID: string;
    emoji: string | null;
    cover: string | null;
    desc: string | null;
    section: string;
    tags: string[];
    lastEdit: string | null;
}

export function postToBlogInfo(post: any): BlogInfo {
    const date = new Date(post.properties?.time?.last_edited_time ?? "");

    return {
        title: post.properties?.title?.title[0]?.plain_text,
        pageID: post.id ?? "/404",
        emoji: post.icon?.emoji,
        cover: post.cover?.file?.url,
        desc: post.properties?.desc?.rich_text[0]?.plain_text,
        section: post.properties?.section?.select?.name,
        tags: post.properties?.tags.multi_select?.map((tag: { name: string; }) => tag.name) ?? [],
        lastEdit: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
    }
}