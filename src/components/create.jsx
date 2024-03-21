/* The create moment modal */

import './create.css'
import happy from '../media/img/happy-face.png'
import { B, E, bBack, bGo, base64ToBlob, copyLink, getLoginDetails } from '../utils/utils';
import { API_URL, w } from '../utils/constants';
import { ModalInfo, setInfo, showModalInfo } from './infomodal';
import QRCode from "qrcode";
import React, { useState } from 'react';
import Text from './text';

/* VARIABLES */
let selectedFile = null

const Create = () => {
    /* STATES */
    const [momentURI, setMomentURI] = useState("")
    const [qrURI, setQrURI] = useState("")
    const qRef = React.createRef();
        
    const onImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check if the file is an image
            if (!file.type.startsWith('image/')) {
                E('create_disp_img').style.display = 'none'
                event.target.files = null;
                selectedFile = null
                return;
            }
            if(file.size > 6 * 1024 * 1024) {
                showModalInfo({
                    msg: 'Max size 6mb',
                    status:'warn',
                    duration:2000
                })
                event.target.files = null
                E('create_disp_img').style.display = 'none'
                selectedFile = null;
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                E('create_disp_img').style.display = 'block'
                E('create_disp_img').style.backgroundImage = `url(${e.target.result})`;
                selectedFile = file
            }
            reader.readAsDataURL(file);
        } else {
            alert('Please select an image file.');
        }
    }
    const hideCreateView = (event) => {
        if(event.target.id == 'create_view_parent') {
            E('create_view_parent').style.display = 'none'
            bBack('create')
        }
    }
    w.hear('create', (value) => { 
        E('create_view_parent').style.display = ''
        //clear view
        selectedFile = null 
        E('create_event').value = ""
        E('create_disp_img').style.display = 'none'
        E('create_select_file').value = ""
        E('create_button').disabled = false
        E('create_moment_edit').style.display = ''
        E('create_bar_view').style.display = "none"
        bGo("create")
    })
    
    /* NAV */
    B("create", null, () => {
        //back pressed, hide view
        E('create_view_parent').style.display = 'none'
    })

    /* DOM FUNCTIONS */
    const createMoments = async (event) => {
        const event_name = E('create_event').value.trim()
        const user = getLoginDetails()
        if(event_name != "" && user.login) {
            event.target.disabled = true
            setInfo({
                msg:'Creating beautiful moments'
            })
            try{ 
                const form = new FormData()
                form.append('photo', selectedFile)
                form.append('owner', user.login)
                form.append('name', event_name)
                const res = await fetch(`${API_URL}/create`, {
                    method: 'POST',
                    body: form
                })
                if(res.ok) {
                    //draw the new moments created
                    const resp = await res.json()
                    if(resp.status) {
                        //show succesful msg
                        setInfo({
                            status:'good',
                            duration:2500,
                            msg:'Horray! Lets start capturing memories'
                        })
                        const uri = (w.location.protocol + '//' + w.location.hostname) + ((w.location.hostname == 'localhost') ? ":" + w.location.port : "") + "?m=" + resp.uri
                        //console.log(uri, w.location.protocol, w.location.hostname)
                        //generate the qr-code
                        QRCode.toDataURL(
                            E('t_canvx'),
                            uri,
                            {
                                width:800,
                                color: {
                                    dark:'#ffa62c',
                                }
                            },
                            (err, url) => {  
                                if(err) return;
                                setMomentURI(uri)
                                setQrURI(url)
                                E('create_moment_edit').style.display = 'none'
                                E('create_bar_view').style.display = ""
                                w.speak('moment_create', [
                                    {
                                        name:event_name,
                                        owner:user.login,
                                        closed:false,
                                        num:0,
                                        date:(new Date()).getTime(),
                                        id:resp.uri.replace('/', ''),
                                        pic:URL.createObjectURL(selectedFile)
                                    }
                                ])
                            }
                        )
                    }
                    else {
                        setInfo({
                            status:'error',
                            duration:2500,
                            msg:'Something went wrong'
                        })
                    }
                }
                else {
                    //something went wrong
                    setInfo({
                        status:'error',
                        duration:2500,
                        msg:'Something went wrong'
                    })
                }
            }
            catch(e) { console.log(e)
                setInfo({
                    status:'error',
                    duration:2500,
                    msg:'Something went wrong'
                })
            }
            event.target.disabled = false
        }
        else if(user.login == "") {
            w.speak('login', false)
            hideCreateView()
        }
    }
    const copyMomentLink = () => {
        copyLink(momentURI)
        setInfo({
            msg: 'Link copied',
            status: 'good',
            duration:2000
        })
    }
    const downloadQr = () => {
        const dL = document.createElement('a')
        E('t_canvx').toBlob((blob) => {
            dL.href = URL.createObjectURL(blob);
            document.body.appendChild(dL)
            dL.target = '_blank'
            dL.click()
            document.body.removeChild(dL)
            URL.revokeObjectURL(blob)
        }, 'image/png')
    };

    return (
        <>
        <ModalInfo />
        <div className="create_" id='create_view_parent' onClick={hideCreateView} style={{display:'none', zIndex:'10'}}>
            <div className='create_modal'>
                <div className='create_head center'>
                    <h3 style={{marginLeft:'5px', marginRight:'5px'}}>Let's create beautiful moments</h3>
                    <img src={happy} />
                </div>
                <div id='create_moment_edit'>
                    <div className='create_body'>
                        <label>Event name</label>
                        <input id='create_event' style={{marginBottom:'15px'}}/>

                        <label>Background image</label>
                        <div id='create_disp_img' className='create_img fullImage'></div>
                        <input onInput={onImageSelect} id='create_select_file' type='file' />
                    </div>
                    <button id='create_button' onClick={createMoments} className='create_button'>Create</button>
                </div>
                <div id='create_bar_view' style={{display:'none'}}>
                    <div id='create_disp_bar' className='center create_img'>
                        <canvas id='t_canvx' style={{display:'none'}}></canvas>
                        <img src={qrURI} />
                    </div> 
                    <div style={{textAlign:'center', margin:'0px 6px'}}>
                        <Text>Share the barcode image with your pals, so they can kick off uploading their priceless moments!</Text>
                    </div> 
                    <div style={{display:'flex'}}>
                        <button onClick={copyMomentLink} className='create_button'>Copy link</button>
                        <button onClick={downloadQr} className='create_button'>Download</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Create