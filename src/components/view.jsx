/* Handles view moments views */
import { useState } from 'react' 
import './view.css';
import { CirularButton } from './button';
import { B, bGo, cmpDate, copyLink, getLoginDetails } from '../utils/utils';
import Centered from './center';
import InfiniteScroll from './pagination';
import Text from './text';
import { API_URL, w } from '../utils/constants';
import { ModalInfo, setInfo, showModalInfo } from './infomodal';
import QRCode from "qrcode";
import MomentViewer from './viewer';


const ViewMoment = ({moment = [], momentData = {}}) => {

    let tempDate = null 
    
    /* functions */
    const drawMainView = (params) => {  
        const dte = (new Date(params.date))
        if(tempDate != null) {
            if(!cmpDate(dte, tempDate)) {
                tempDate = dte
                return (
                    <>
                        <div className='center' style={{width:'100%'}}>
                            <div className='view_date center'>
                                <span className='fa-regular fa-calendar-days' style={{fontSize:'13px', marginRight:'3px'}}></span>
                                <span>
                                    {fDate(dte)}
                                </span>
                            </div>
                        </div>
                        <div onClick={(event) => showViewer(params.moment)} className='view_moment fullImage v_size' style={{backgroundImage:`url(${params.moment})`}}>
                        <div className='view_time centre'>
                            {dte.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit', hour12: true})}
                        </div>
                        </div>  
                    </>
                )
            }
            else { 
                return (
                    <div onClick={(event) => showViewer(params.moment)} className='view_moment fullImage v_size' style={{backgroundImage:`url(${params.moment})`}}>
                        <div className='view_time centre'>
                            {dte.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit', hour12: true})}
                        </div>
                     </div>
                )
            }
        }
        else {
            tempDate = dte
            return (
                <>
                <div className='center' style={{width:'100%'}}>
                    <div className='view_date center'>
                        <span className='fa-regular fa-calendar-days' style={{fontSize:'13px', marginRight:'3px'}}></span>
                        <span>
                            {fDate(dte)}
                        </span>
                    </div>
                </div>
                <div onClick={(event) => showViewer(params.moment)} className='view_moment fullImage v_size' style={{backgroundImage:`url(${params.moment})`}}>
                    <div className='view_time centre'>
                        {dte.toLocaleTimeString([], {hour: 'numeric', minute: '2-digit', hour12: true})}
                    </div>
                </div>
                </>
            )
        }
    }
    const fDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        let suffix = 'th';
    
        // Determine the suffix for the day
        if (day === 1 || day === 21 || day === 31) {
            suffix = 'st';
        } else if (day === 2 || day === 22) {
            suffix = 'nd';
        } else if (day === 3 || day === 23) {
            suffix = 'rd';
        }
    
        // Format the date
        return day + suffix + ' ' + month;
    }

    const [moments, addMoments] = useState(moment)
    const [refreshFlag, setRefreshStatus] = useState(false)
    const [momentURI, setMomentURI] = useState("")
    
    bGo("v") 
    B('v', () => {
        //hide the viewer
        setMomentURI("")
    })
    w.hear('hide_viewer', () => {
        setMomentURI("")
    })

    /* DOM FUNCTIONS */
    const copyMomentLink = () => {
        const id = momentData.id
        const uri = (w.location.protocol + '//' + w.location.hostname) + ((w.location.hostname == 'localhost') ? ":" + w.location.port : "") + "/" + id
        copyLink(uri)    
        setInfo({
            msg:'Copied', status:'good', duration:1500
        })   
    }
    //to download qr code
    const downloadQr = () => {
        const id = momentData.id
        const uri = (w.location.protocol + '//' + w.location.hostname) + ((w.location.hostname == 'localhost') ? ":" + w.location.port : "") + "/" + id
        const cnv = document.createElement('canvas')
        QRCode.toDataURL(
            cnv,
            uri,
            {
                width:800,
                color: {
                    dark:'#ffa62c',
                }
            },
            (err, url) => {  
                if(err) return;
                cnv.toBlob((blob) => {
                    const dL = document.createElement('a')
                    dL.href = URL.createObjectURL(blob);
                    document.body.appendChild(dL)
                    dL.target = '_blank'
                    dL.click()
                    document.body.removeChild(dL)
                    URL.revokeObjectURL(blob)
                }, 'image/png')
            }
        )     
    }
    //to upload a moment
    const uploadMoment = (event) => {
        const imgF = document.createElement('input')
        imgF.type = "file"
        imgF.filter = 'image/*'
        imgF.oninput = async (event) => {
            const file = event.target.files[0];
            if (file) {
                // Check if the file is an image
                if (!file.type.startsWith('image/')) {
                    return;
                }
                if(file.size > 6 * 1024 * 1024) {
                    showModalInfo({ 
                        msg: 'Max size 6mb',
                        status:'warn',
                        duration:2000
                    })
                    return;
                } 
                setInfo({
                    status:'norm',
                    msg:"Uploading"
                })
                const user = getLoginDetails() || {login:"guest"}
                const form = new FormData()
                form.append('photo', file)
                form.append('owner', user.login)
                form.append('id', momentData.id)
                const res = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    body: form
                })
                if(res.ok) {
                    //draw the new moments created
                    const resp = await res.json(); console.log(resp)
                    if(resp.status) {
                        //show succesful msg
                        setInfo({
                            status:'good',
                            duration:2500,
                            msg:'Horray!'
                        })
                        //add new moment
                        let elem = moments
                        elem.unshift(resp)
                        addMoments(elem)
                        setRefreshStatus(!refreshFlag)
                        setTimeout(() => {w.speak('pagination_refresh', true)}, 1000)
                    }
                    else {
                        setInfo({
                            status:'error',
                            duration:2500,
                            msg:'Something went wrong'
                        })
                    }
                }
            } 
        }
        imgF.click()    
    }
    //to show a moment viewer
    const showViewer = (uri) => {setMomentURI(uri)}
    return (  
        <>
        <ModalInfo />
        <div className='view_main'>
            <div className='full view_buttons'>
                <CirularButton onClick={uploadMoment} color="primary" _style={{marginLeft:'20px', zIndex:'1'}}>
                    <span className='fa-solid fa-camera'></span>
                </CirularButton>
                <CirularButton onClick={downloadQr} color="normal" _style={{marginLeft:'20px', zIndex:'1'}}>
                    <span className='fa-solid fa-qrcode'></span>
                </CirularButton>
                <CirularButton onClick={copyMomentLink} color="secondary" _style={{marginLeft:'20px', zIndex:'1'}}>
                    <span className='fa-solid fa-link'></span>
                </CirularButton>
            </div> 
            <div className='full' style={{marginLeft:'-100%'}}>
                {(moments.length > 0) ?  
                    <InfiniteScroll 
                    classN='view_main_disp'
                    item={[...moments.map(drawMainView)]}
                    refresh={refreshFlag}
                    pageSize={30}
                    pageAdd={10}
                    />
                :
                    <Centered type='full'>
                            <Text _style={{textAlign:'center', margin:'0px 15px',  fontSize:'18px'}}>Be the first to upload a moment<br />
                             Tap the <span className='fa-solid fa-camera'></span> to do so</Text>
                    </Centered>
                }
                
            </div>
        </div>
        <MomentViewer 
            uri={momentURI}
        />
        </>
    )

}

export default ViewMoment