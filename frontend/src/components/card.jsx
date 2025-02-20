import React from "react";
import "../index.css";
import Image from "../assets/th.jpeg";

function Card({ Details = {} }) {
    return (
        <div className="bg-blue-200 rounded-2xl p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
                <div className="flex-shrink-0">
                    <div className="border-2 border-gray-400 rounded-2xl w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40">
                        <img
                            src={Details.img || Image}
                            className="w-full h-full rounded-2xl object-cover"
                            alt="Patient"
                        />
                    </div>
                </div>
                <div className="flex flex-col justify-between">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                        {Details.name || "Patient"}
                    </h1>
                    <table className="text-left mt-2 sm:mt-4 lg:mt-6 text-sm sm:text-base lg:text-lg">
                        <tbody>
                            <tr>
                                <th className="font-normal pr-4">Age : </th>
                                <th className="font-medium pr-4">{(Details.age && `${Details.age} Years`) || "--"}</th>
                            </tr>
                            <tr className="font-medium">
                                <td className="pr-4 font-normal">Sex : </td>
                                <td>{Details.sex || "--"}</td>
                            </tr>
                            <tr>
                                <td className="font-normal">Relationship :</td>
                                <td>{Details.relationship || "Self"}</td>
                            </tr>
                            <tr>
                                <td className="font-normal">Number :</td>
                                <td>{Details.contact || "----- -----"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 sm:mt-6 lg:mt-8">
                <table className="text-left text-sm sm:text-base lg:text-lg">
                    <tbody>
                        <tr>
                            <td className="font-normal">
                                Rank:{" "}
                                <span className="font-semibold">
                                    {Details.rank || "--"}
                                </span>{" "}
                                <span className="ml-2 sm:ml-4 lg:ml-8">
                                    Service:{" "}
                                    <span className="font-semibold">
                                        {Details.service || "Air Force"}
                                    </span>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td className="font-normal">
                                Arm/Corp/Branch/Trade:{" "}
                                <span className="font-semibold">
                                    {"Patient"}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Card;
