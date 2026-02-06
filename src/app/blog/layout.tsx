import Banner from "@/components/Banner";

import "./layout.scss";

const BlogPagesLayout = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (<>
        <main id="blog-main">
            <Banner><b>稽之博客</b></Banner>
            <div className="content-wrapper">
                {children}
            </div>
        </main>
    </>);
}

export default BlogPagesLayout;