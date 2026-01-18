import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { storageToysUrl } from "src/constants/storage";

const ToyRedirect: React.FC = () => {
    const { slug } = useParams() ?? {};

    useEffect(() => {
        window.location.href = `${storageToysUrl}/${slug}/`
    }, [slug]);
    return null;
}

export default ToyRedirect;