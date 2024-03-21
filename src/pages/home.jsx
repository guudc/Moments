import '../css/home.css';
import '../index.css'
import Centered from '../components/center'
import { CirularButton } from '../components/button';
import Text from '../components/text';
import ImageOverlay from '../components/imageoverlay';
import defaultImg from '../media/bg/default.jpg'
import google from '../media/img/google.png'
import Head from '../components/header';
import { useEffect, useState } from 'react';
import { API_URL, w } from '../utils/constants';
import { getMoments } from '../utils/api';
import Loading from '../components/loading';
import Create from '../components/create';
import { B, getLoginDetails, loadImage, useRefer } from '../utils/utils';
import MomentView from '../components/moment_view';
import { showModalInfo } from '../components/infomodal';
import NetworkError from '../components/error';
import ViewMoment from '../components/view';

/* GLOBALS */

let hasLoadUserMomentFlg = false
const Home = () => {
    /* STATES */
    const [landingScreen, setLandingScreen] = useState(true) //login state
    const [isLogin, setLoginState] = useState(false) //login state
    const [isView, setViewState] = useState(false) //moment view state
    const [isViewStateError, setViewStateError] = useState(false) //user state
    const [isViewLoading, setViewLoadingState] = useState(false) //moment loading state
    const [isUserState, setUserState] = useState(false) //user state
    const [isUserStateError, setUserStateError] = useState(false) //user state
    const [temp_moment, setTempMoment] = useState([])
    const [temp_view_moment, setTempViewMoment] = useState(null)
    const [imageOverlayURI, setOverlayImage] = useState("")
     

    /* Hearing hooks */
    w.hear('login', async (status) => {  
        setLoginState(status);
        if(status) { 
            if(!isView) {
              getUserMoments(true)
            }
        }
        else {
            setUserState(false)
        }
    }, )
    w.hear('profile', (status) => {
        setUserState(true)
        setViewState(false)
        w.speak('head_title', "Hi, " + JSON.parse(getLoginDetails().loginData).displayName)
        setOverlayImage("")
        //load user moments, if it hasnt
        if(!hasLoadUserMomentFlg) {
            getUserMoments()
        }
    })
    w.hear('error_refresh', (errId) => {
        //an error refresh button has been pressed
        if(errId == 'user_moment') {
            //to reload user moment details
            setUserStateError(false)
            getUserMoments()
        }
        else if(errId == 'view_moment') {
            //to reload user moment details
            setViewStateError(false)
            getMomentView()
        }
    })
    w.hear('moment_create', (data = []) => {  
        //to load moment data if its afresh
        if(data.length < 1) return;
        if(!isUserState) {
            if(isLogin && !isView) {
                //can show the user state
                setUserState(true)
                setTempMoment(data)
            }
        }
        
    })

    /* NAV */
    B("", () => {
         
    })

    useEffect(() => {
        //fetch moment data
        getMomentView()
        setTimeout(() => {
            setLandingScreen(false)
        }, 2000)
    }, [])

    /* API Fetchs */
    const getUserMoments = async () => {
        try{
                setViewLoadingState(true)
                const res = await fetch(`${API_URL}/getall`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body:JSON.stringify({
                        user:getLoginDetails().login
                    })
                })
                setViewLoadingState(false)
                if(res.ok) {
                    setUserStateError(false)
                    const resp = await res.json()
                    hasLoadUserMomentFlg = true
                    if(resp.status == true) {
                        setUserState(true)
                        setTempMoment(resp.moments)
                    }
                    else {
                        setUserState(false)
                    }
                }
                else {
                    setUserStateError(true)
                    w.speak('error_load', 'user_moment')
                }
        }
        catch(e) { console.log(e)
            setUserStateError(true)
            setViewLoadingState(false)
            w.speak('error_load', 'user_moment')
        }
    }
    const getMomentView = () => {
        let uri = w.location.href
        if(uri.lastIndexOf('/') > -1) {  
            uri = uri.substring(uri.lastIndexOf('/') + 1)
            //remove any other parts if present
            if(uri.indexOf('?') >  -1) {
                uri = uri.substring(0, uri.lastIndexOf('?'))
            }
            if(uri.indexOf('/') >  -1) {
                uri = uri.substring(0, uri.lastIndexOf('/'))
            }
            if(uri != "") {  
                setViewLoadingState(true)
                setViewState(true)
                //fect moment data
                getMoments(uri, (data, err) => {   
                    setViewLoadingState(false);  
                    if(data != false) {
                        w.speak('head_title', data.name)
                        setTempViewMoment(data)
                        setOverlayImage(data.pic)
                    }
                    else if(err !== 0){
                        //no moment
                        setViewState(false)
                        if(isLogin) {
                            //do the moments profile state
                            getUserMoments()
                        }
                    }
                    else { 
                        //network error
                        setViewStateError(true)
                    }
                })
            }
        }
    }

    /* Dom Functions */
    const login = () => {w.speak('call_login', true)}
    const create = () => {w.speak('create', true)}

  
    return (
        <>
        {(landingScreen) ?
            <div className='grain center'>
                <img className='landing_img' src={defaultImg} />
                <Text _style={{fontSize:'20px'}}>Moments</Text>
            </div>
        :
        <div className='grain'>
            <ImageOverlay img={imageOverlayURI} _style={{display:'flex', flexDirection:'column'}}>
                <Head />
                <Create/>

                {(isViewLoading) ? 
                    <Loading />
                    : ""
                }
                {(isView && !isViewStateError) ? 
                    (temp_view_moment != null) ?
                    <ViewMoment 
                        moment={temp_view_moment.moments}
                        momentData={temp_view_moment}
                    />
                    : ""
                    :
                (isViewStateError) ?
                <NetworkError type='view_moment'/>
                :
                (!isUserState && !isUserStateError ) ?
                <Centered type='ver'>
                    {(!isView) ? 
                         (isLogin) ?
                         <Text _style={{textAlign:'center', margin:'0px 15px', fontSize:'18px'}}>Click the '+' button to create your moments</Text>
                         :
                         <Text _style={{textAlign:'center', margin:'0px 15px',  fontSize:'18px'}}>Sign up with google to begin creating your moments</Text>
                        :
                        ""
                    }
                    
                    <Centered _style={{marginTop:'20px'}}>
                       {(isLogin) ?
                           <CirularButton onClick={create} color="secondary" _style={{marginLeft:'20px'}}>
                            <span className='fa-regular fa-plus'></span>
                           </CirularButton>
                            :
                           <CirularButton onClick={login} color="button" _style={{marginLeft:'20px'}}>
                             <img className='fullImage' src={google} style={{width:'100%', height:'100%'}} />
                           </CirularButton>
                       } 
                        
                    </Centered>
                </Centered>
                : (!isUserStateError && isUserState) ?
                <MomentView 
                    moment={temp_moment}
                />
                :
                <NetworkError type='user_moment'/>
                }

            </ImageOverlay>
        </div>
        }
        </>
    )
}

export default Home;