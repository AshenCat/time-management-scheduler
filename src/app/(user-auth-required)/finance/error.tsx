"use client";
import React, { useEffect } from "react";

function ErrorPage({ error }: { error: Error }) {
    useEffect(() => {
        console.error(error);
    }, [error]);
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-2xl text-red-500">
                Error fetching finance data
            </div>
        </div>
    );
}

export default ErrorPage;
