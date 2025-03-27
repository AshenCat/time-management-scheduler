import React from "react";

function loading() {
    return (
        <div className="flex items-center  justify-center  h-screen bg-gray-100">
            <div id="spinner-container" className="space-y-10">
                <div className="flex justify-center">
                    <span className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                </div>
            </div>
        </div>
    );
}

export default loading;
