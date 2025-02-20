import React from "react";

function Header({ Department }) {
    return (
        <div className="bg-gray-300 overflow-x-hidden mb-20">
            <header className="flex flex-col md:flex-row justify-between items-center font-semibold text-2xl md:text-4xl w-11/12 m-auto p-5 md:p-10 mb-12">
                <div className="flex flex-col gap-1 justify-center text-center md:text-left">
                    <h1>14 Airforce Hospital</h1>
                    <h2 className="font-normal text-xl md:text-3xl">Dundigal</h2>
                </div>
                <div className="flex flex-col justify-center items-center mt-5 md:mt-0 text-center md:text-right">
                    <h1>Department of {Department}</h1>
                </div>
            </header>
        </div>
    );
}

export default Header;
