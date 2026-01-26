"use client";

import { storageToysUrl } from "@/constants/storage";
import React, { useEffect } from "react";

const ToyRedirect: React.FC<{ slug: string }> = ({ slug }) => {
    useEffect(() => {
        window.location.href = `${storageToysUrl}/${slug}`;
    });

    return null;
}

export default ToyRedirect;