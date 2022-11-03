import React from "react";

import { AiOutlineSearch } from "react-icons/ai";

const Search = React.memo(
    function Search ({value,setSearch}){
        return (
            <p className="search">
                <AiOutlineSearch />
                <input
                    placeholder="Поиск"
                    value={value}
                    onInput={(e) =>setSearch(e.target.value)}
                />
            </p>
        )
    }
)

export default Search