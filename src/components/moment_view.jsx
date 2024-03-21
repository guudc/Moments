/* Handles moments views */
import { useState } from 'react'
import { w } from '../utils/constants'
import { CirularButton } from './button'
import './moment.css'
import Text from './text'
import { copyLink, fSize } from '../utils/utils'
import InfiniteScroll from './pagination'
import QRCode from "qrcode";
import { ModalInfo, setInfo } from './infomodal'

const MomentView = ({moment = [], refresh = false}) => {
    /* DRAWS */
    const drawMomentView = (params) => {
        return (
            <div className='moment_view center m_size' key={params.id}>
                <div onClick={(event) => goToMoment(params.id)} className='moment_view_img full fullImage' style={{
                    backgroundImage:`url('${params.pic}')`, zIndex:'2'
                }}></div>
                <div className='full' style={{marginLeft:'-100%', display:'flex', flexDirection:'column', }}>
                    <div style={{display:'flex', flexDirection:'row-reverse', marginTop:'5px', alignItems:'center'}}>
                        <CirularButton onClick={(event) => copyMomentLink(event, params.id)} width='30px' height='30px' color='secondary' _style={{boxShadow:'none', marginLeft:'5px', marginRight:'5px', fontSize:'13px', zIndex:'2'}}><span className='fa-solid fa-link'></span></CirularButton>
                        <CirularButton onClick={(event) => downloadQr(params.id)} width='30px' height='30px' color='normal' _style={{boxShadow:'none', fontSize:'13px', zIndex:'2'}}><span className='fa-solid fa-share-alt'></span></CirularButton>
                        <Text _style={{marginRight:'auto', marginLeft:'10px', zIndex:'2'}}> 
                            <span className='fa-solid fa-photo-film' style={{marginRight:'2px', fontSize:'12px'}}></span>
                            <span>{fSize(params.num || 0)}</span>
                        </Text>
                    </div>
                    <div className='moment_view_name' style={{zIndex:'3'}}>
                      <span>{params.name}</span>
                    </div>
                </div>
            </div>
        )
    }

    /* DOM FUNCTIONS */
    const newMoment = () => {
        w.speak('create', true)
    }
    const copyMomentLink = (e, id) => {
        const uri = (w.location.protocol + '//' + w.location.hostname) + ((w.location.hostname == 'localhost') ? ":" + w.location.port : "") + "?m=" + id
        copyLink(uri)    
        setInfo({
            msg:'Copied', status:'good', duration:1500
        })   
    }
    const downloadQr = (id) => {
        const uri = (w.location.protocol + '//' + w.location.hostname) + ((w.location.hostname == 'localhost') ? ":" + w.location.port : "") + "?=" + id
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
    const goToMoment = (id) => {
        const uri = (w.location.protocol + '//' + w.location.hostname) + ((w.location.hostname == 'localhost') ? ":" + w.location.port : "") + "?m=" + id
        window.location.href = uri
    }

    /* STATES */
    const [moments, addMoments] = useState([...moment.map(drawMomentView)])
    const [links, setMomentLinks] = useState([...moment.map((e) => {return e.id})])
    const [refreshFlag, setRefreshStatus] = useState(true)

    
    /* HEARINGS */
    w.hear('moment_create', (data = []) => {  
        //to load moment data
        const elm = moments
        const lnks = links
        if(data.length > 0) {
            for(let i=0;i<data.length;i++) {
                if(!lnks.includes(data[i].id)) {
                    elm.unshift(drawMomentView(data[i]))
                    lnks.push(data[i].id)
                }
            }
            addMoments(elm)
            setMomentLinks(lnks)
            setRefreshStatus(!refreshFlag)
        }
    })
    return (
        <>
        <ModalInfo />
        <InfiniteScroll 
            classN='moment_main'
            item={moments}
            fixed={<div onClick={newMoment} className='moment_new center m_size'>
            <span className="fa-regular fa-plus"></span>
            </div>}
            refresh={refreshFlag}
            pageSize={30}
            pageAdd={10}
        />
        </>
    )

}

export default MomentView