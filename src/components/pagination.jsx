/* HANDLES PAGINATIONS COMPONENT */

import { w } from "../utils/constants"
const { useState, useEffect } = require("react")
const { RectButton } = require("./button")


let tempRefresh = false

const InfiniteScroll = ({item = [], fixed = <></>, refresh=false, pageSize = 30, pageAdd = 15, _style = {}, classN= ""}) => {
    /* STATES */
    const [endIndex, setEndIndex] = useState((item.length > pageSize) ? pageSize : item.length)
    const addMore = () => {
        setEndIndex(endIndex + pageAdd)
    } 
    
    w.hear('pagination_refresh', () => {
        setEndIndex((item.length > pageSize) ? pageSize : item.length)
    })

    return (
        <div  style={{width:'100%', height:'100%', overflow:'auto'}}>
            <div className={classN} style={_style}>
                {fixed}
                {item.slice(0, endIndex)}
            </div>
            <div style={{height:'20px', width:'100%'}}></div>
            {(endIndex < item.length) ? 
            <div className="center"><RectButton onClick={addMore} color="primary" _style={{margin:'20px auto', fontSize:'14px'}}>More</RectButton></div>
               : "" }
        </div>
    )
}

export default InfiniteScroll