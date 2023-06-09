import {  useState } from 'react'
import react from "react";
import data from "./ListData.json"

function List() {
    return (
        <ul>
            {data.map((item) => (
                <li key={item.id}>{item.text}</li>
            ))}
        </ul>
    )
}

export default List