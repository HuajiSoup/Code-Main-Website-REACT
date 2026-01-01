import { Helmet } from "react-helmet";

const TitleSetter: React.FC<{title: string}> = ({ title }) => {
    return (
        <Helmet>
            <title>{title}</title>
        </Helmet>
    );
}

export default TitleSetter;