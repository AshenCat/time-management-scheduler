"use client";
import useFetch from "@/app/(components)/(reusable)/hooks/useFetch";
import React, { useState } from "react";

function Dashboard() {
    const [groupBy, setGroupBy] = useState<
        "weekly" | "monthly" | "yearly" | "all-time"
    >("yearly");
    const [financeDataLoading, financeDataError, financeData] = useFetch(
        `/api/finance?group-by=${groupBy}`,
        {},
        [groupBy]
    );
    console.log("financeDataLoading======================");
    console.log(financeDataLoading);
    console.log("financeDataError======================");
    console.log(financeDataError);
    console.log("financeData======================");
    console.log(financeData);
    return <div></div>;
}

export default Dashboard;
