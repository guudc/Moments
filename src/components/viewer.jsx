/* Handles view moments views */
import { useState } from 'react'  
import "./view.css"
import { B, bGo, bBack } from '../utils/utils'
import { w } from '../utils/constants'

const MomentViewer = ({uri}) => {
 
    bGo("i") 
    B("i", null, () => {
        w.speak("hide_viewer", true)
        bBack('create')
    })
    
    return (  
        <>
        {(uri != "") ?
         <div className='moment_viewer' >
                <div className='full moment_view_bg'
                    style={{backgroundImage:`url(${uri})`}}
                ></div>
                <div className = 'full moment_view_main'
                 style={{backgroundImage:`url(${uri})`}}
                 ></div>
         </div>
         :""}
        </>
    )

}

export default MomentViewer