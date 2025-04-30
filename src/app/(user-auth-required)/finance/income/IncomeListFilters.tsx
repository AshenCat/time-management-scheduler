"use client";
import KeywordSearchBar from "@/app/(components)/(ListComponents)/(filters)/KeywordSearchBar";
import SearchDeleted from "@/app/(components)/(ListComponents)/(filters)/SearchDeleted";
import React from "react";

function IncomeListFilters() {
    return (
        <div className="flex flex-col gap-2 ">
            <div className="flex justify-between">
                <SearchDeleted URL="/finance/income?" />
                {/* <SearchByTags URL="/finance/income?" /> */}
                <KeywordSearchBar URL="/finance/income?" />
            </div>
        </div>
    );
}

export default IncomeListFilters;
