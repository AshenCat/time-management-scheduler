"use client";
import KeywordSearchBar from "@/app/(components)/(ListComponents)/(filters)/KeywordSearchBar";
import SearchByTags from "@/app/(components)/(ListComponents)/(filters)/SearchByTags";
import SearchDeleted from "@/app/(components)/(ListComponents)/(filters)/SearchDeleted";
import SortToggleButton from "@/app/(components)/(ListComponents)/(filters)/SortToggleButton";
import React from "react";

function ExpensesListFilters() {

    return (
        <div className="flex flex-col gap-2 ">
            <div className="flex justify-between">
                <SearchDeleted URL="/finance/expenses?" />
                <SearchByTags URL="/finance/expenses?" />
            </div>
            <div className="flex flex-col md:flex-row justify-between">
                <SortToggleButton URL="/finance/expenses?" />
                <KeywordSearchBar URL="/finance/expenses?" />
            </div>
        </div>
    );
}

export default ExpensesListFilters;
