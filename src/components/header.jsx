/* Header component */

import { useEffect, useState } from "react";
import { E, bigClick, getLoginDetails, loadImage, onRender, setTheme } from "../utils/utils";
import google from '../media/img/google.png'
import { authLogin, authUserSilently, getUserSilently, useAuthLogin } from "../utils/api";
import { w } from "../utils/constants";
import './header.css'

let isLoad = false //to check for first load
let curTheme = localStorage.getItem('theme_type') || 'white'
const changeTheme = () => {
    //get current theme type
    if(curTheme == 'white') {
        //toggle to black
        curTheme = 'dim'
        setTheme(curTheme)
        E('theme_icon').className = 'fas fa-moon'
        E('theme_icon').style.marginLeft = 'auto'
    }
    else {
        curTheme = 'white'
        setTheme(curTheme)
        E('theme_icon').className = 'fas fa-sun'
        E('theme_icon').style.marginLeft = '3px'
        E('theme_icon').style.transform = 'rotate(180deg)'
    }
    localStorage.setItem("theme_type", curTheme)
}
const Head = () => {
    /* STATES */
    const [loginState, setLoginState] = useState(false);
    const [headerTitle, setHeaderTitle] = useState("");
    
    //fetch the current user states
    useEffect(() => {
        async function fetchData() {  
            const user = getLoginDetails();  
            if (user !== false) {
                setLoginState(true);
                onRender('user_head_pic', () => {
                    loadImage('user_head_pic', JSON.parse(user.loginData).pic, 2)
                })
                w.speak('login', true); 
                setHeaderTitle("Hi, " + JSON.parse(user.loginData).displayName)
                // Fetch user data from the API
                getUserSilently(user.login, (data, err) => {  
                    if(data !== false) {
                        onRender('user_head_pic', () => {
                            loadImage('user_head_pic', data.pic, 2)
                        })
                        setHeaderTitle("Hi, " + data.displayName)
                    }
                    else if(err == 1000){
                        //log out
                        setLoginState(false)
                        w.speak('login', false)
                    }
                  })
            } else {
                setLoginState(false);
            }
        }
        if(!isLoad) { 
            isLoad = true
            fetchData();
        }
    }, [])

    /* hearings */
    w.hear('call_login', (value) => {
        //do login function, if not login
        if(!loginState) {login()}
    })
    w.hear('head_title', (title) => {
        setHeaderTitle(title)
    })

    /* DOM FUNCTIONS */
    const login = useAuthLogin((userData) => {
        if(userData !== false) { 
            //authenticated
            setLoginState(true)
            w.speak('login', true)
            onRender('user_head_pic', () => {
                loadImage('user_head_pic', userData.pic, 2)
            })
        }
    })
    const logOut = (event) => {
        localStorage.setItem('moments', "")
        localStorage.setItem('moments_user_data', "")
        w.speak('login', false)
        setLoginState(false)
    }
    const profile = (e) => {
        e.stopPropagation()
        if(E('header_profile_det').style.display != 'flex') {
            E('header_profile_det').style.top = ((E('user_head_pic').getBoundingClientRect().top) + 10) + 'px'
            E('header_profile_det').style.display = 'flex'
            bigClick(E('header_profile_det'), () => {
                if(E('header_profile_det') != null) {
                    E('header_profile_det').style.display = 'none'
                }
            })
        }
        else {
            E('header_profile_det').style.display = 'none'
        }
    }
    
    return (
      <div style={{
            display:'flex',
            alignItems:'center',
            height:'40px',
            color:'var(--secondary)',
            userSelect:'none',
            flexShrink:'0',
            zIndex:'3'
        }}>
        <div className="header_title" style={{zIndex:'2', marginLeft:'10px', marginRight:'auto'}}>
            {headerTitle}
        </div>
        <div className="center circle" style={{border:'2px solid var(--primary)', width:'25px', height:'25px',  cursor:'pointer', zIndex:'2'}}>
            <div className="center" style={{width:'calc(100% - 4px)', height:'calc(100% - 4px)', color:'var(--primary)'}}>
                {(!loginState) ?
                    <img  onClick={login} className='fullImage' src={google} style={{width:'100%', height:'100%'}} />
                    : 
                    <>
                    <div onClick={profile} id='user_head_pic' className='fullImage circle'  style={{width:'100%', height:'100%'}}></div>
                    <div onClick={() => E('header_profile_det').style.display = 'none'} id='header_profile_det' className="header_profile_nav">
                        <div onClick={() => {w.speak('profile', true)}}>Profile</div>
                        <div onClick={logOut}>Sign out</div>
                    </div>
                    </>
                }
            </div>
        </div>
        <div onClick={changeTheme} style={{width:'35px', border:'2px solid var(--secondary)', borderRadius:'20px', zIndex:'2',
             cursor:'pointer', display:'flex',  marginLeft:'20px', padding:'2px 0px',
             marginRight:'10px', alignItems:'center'}}>
             {(curTheme == 'white') ?  
                <span id='theme_icon' className="fas fa-sun" style={{marginLeft:'3px', marginRight:'3px', fontSize:'17px'}}></span>
             :      
             <span id='theme_icon' className="fas fa-moon" style={{marginLeft:'3px', marginRight:'3px', fontSize:'17px'}}></span>
             }   
        </div>
      </div>
    );
};

export default Head;