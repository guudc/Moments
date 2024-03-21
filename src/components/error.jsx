/* NETWORK ERROR MODAL */

import { useState } from "react"
import { w } from "../utils/constants"
import { RectButton } from "./button"
import Loading from "./loading"

const { default: Centered } = require("./center")
const { default: Text } = require("./text")


const NetworkError = ({ type = ""}) => {
    /* STATES */
    const [isViewLoading, setLoadingState] = useState(false)

    /* HEARINGS */
    w.hear('error_load', (errId) => {
        if(errId == type) {
            //refresh error view
            setLoadingState(false)
        }
    })
    /* DOM FUNCTIONS */
    const refresh = () => {
        w.speak('error_refresh', type)
        setLoadingState(true)
    }

    return (
        <Centered type='ver' _style={{color:'var(--info)'}}>
            {(isViewLoading ) ? 
                <Loading />
                : ""
            }
            <Text _style={{textAlign:'center', fontSize:'20px', color:'var(--info)'}}>
                Something went wrong<br /> This may be due to network error
            </Text>
        <i className="fa-solid fa-circle-exclamation" style={{
            fontSize:'40px', marginTop: '10px'
        }}></i>
        <RectButton onClick={refresh} color="error" width='auto' height='auto' _style={{padding:'10px', marginTop:'20px'}}>
            Refresh
        </RectButton>
        </Centered>
    )
}

export default NetworkError