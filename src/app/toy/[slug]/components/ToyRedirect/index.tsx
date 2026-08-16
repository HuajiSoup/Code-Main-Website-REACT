"use client";

import { baseUrl } from "@/constants/storage";
import React, { useEffect } from "react";

const ToyRedirect: React.FC<{ slug: string }> = ({ slug }) => {
    useEffect(() => {
        window.location.href = `${baseUrl}/toys/${slug}`;
    });

    return null;
}

export default ToyRedirect;