import React from 'react'
import styled from 'styled-components';
import { E } from '../utils/utils'
let sho = Math.random(); let showTimer 
const ModalHead = styled.div `
   position:fixed;
   top:0px;left:0px;
   width:100vw;
   height:1px;
   display:none;
   align-items:flex-start;
   z-index:400;
`
const ModalBody = styled.div `
   padding:15px 20px;
   background-color: #fff;
   min-height:40px;
   color:black;
   font-size:20px;
   margin-left:auto;margin-right:80px;
   margin-top:120px;
   box-shadow:0 0 6px 3px rgba(0,0,0,.1);
   border-radius:10px;
   display:flex;
   align-items:center;
   max-width:350px;
`
const ModalMsg = styled.span `
    margin-left:10px;
    margin-right:10px;
    margin-top:0px;
`

const showModalInfo = (_canShow) => {
    if(_canShow) {
        if(E('modal_info_msg') != null){
            (E('modal_info_msg')).style.display = "flex"
        }
        //stop timer
        try{clearTimeout(showTimer)} catch(e) {}
    }
    else{
        if(E('modal_info_msg') != null){
            (E('modal_info_msg')).style.display = "none"
        }
    }
}
const hideModalInfo = (_timeOut = 3000) => {
     try{clearTimeout(showTimer)} catch(e) {}
     showTimer = setTimeout(() => {
        (E('modal_info_msg')).style.display = "none"
     }, _timeOut)
}
const setModalMsg = (_msg) => {
    if(E('modal_info_msg_body') != null){
         (E('modal_info_msg_body')).innerHTML = _msg
    }
}
const setModalStaus = (_type) => {
    const _t = E('modal_info_msg_status')
    if(_type == 'error'){
        if(_t != null){
            (E('modal_info_msg_status')).className = "fa-solid fa-times"
            _t.style.color = "red"
        }
    }
    else if(_type == 'good'){
        if(_t != null){
            (E('modal_info_msg_status')).className = "fa-regular fa-check-circle"
            _t.style.color = "limegreen"
        }
    }
    else {
        if(_t != null){
            (E('modal_info_msg_status')).className = "fa-solid fa-spinner fa-spin"
            _t.style.color = ""
        }
    }
}
//to set info modal
const setInfo = (params) => {
    showModalInfo(params.status || true)
    setModalMsg(params.msg || "")
    setModalStaus(params.status || "")
    if(params.duration) {
      hideModalInfo(params.duration || 3000)
    }
}
const ModalInfo = () => {
 
    return (
        <>
            <ModalHead id='modal_info_msg'>
                <ModalBody>
                    <span id='modal_info_msg_status' className='fas fa-spinner fa-spin' style={{marginTop:'0px'}}></span>
                    <ModalMsg id='modal_info_msg_body'>Loading</ModalMsg>
                </ModalBody>
            </ModalHead>
        </>
    )

}

export {ModalInfo, setInfo, showModalInfo, hideModalInfo, setModalMsg, setModalStaus}