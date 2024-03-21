/* HANDLES APIs CALLS */
import { useGoogleLogin } from '@react-oauth/google';
import { API_URL } from './constants';
import axios from 'axios' 
//auth user silently
const authUserSilently = (code = "", callback) => {
    if(code != "") {  
        //authenticate
        fetch(`${API_URL}/auth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                auth:code
            })
        }).then((response) => response.json()
        .then((resp) => { 
            //save back the results
            if(resp.status == true) {
                localStorage.setItem('moments', resp.user.userId)
                localStorage.setItem('moments_user_data', JSON.stringify(resp.user))
                callback(resp.user)
            }
            else {
                callback(false)
            }
        }))
        .catch(err => callback(false))
    }
}
//auth with google
const useAuthLogin = (callback) => {  
    //google hook
    const authGoogle = useGoogleLogin ({
        onSuccess: res => {
            //save back to the 
            if(res.code != "") {
                authUserSilently(res.code, callback)
            }
        },
        onError: () => {  
            callback(false)
        },
        flow: 'auth-code',
    });
    return authGoogle
}
//fetch user data silently
const getUserSilently = (userId = "", callback) => {
    if(userId != "") {  
        //authenticate
        fetch(`${API_URL}/user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'auth' : userId
            },
        }).then((response) => response.json()
        .then((resp) => {   
            //save back the results
            if(resp.status == true) {
                callback(resp.user)
            }
            else{
                callback(false, 1000)
                if(resp.errNo == 1000){
                    //log out user
                    localStorage.setItem('moments', "")
                    localStorage.setItem('moments_user_data', "")
                }
            }
        }))
        .catch(err => callback(false, 0))
    }
}
//fetch user data silently
const getMoments = (id = "", callback) => {
    if(id != "") {  
        //authenticate
        fetch(`${API_URL}/moments`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                id:id
            })
        }).then((response) => response.json()
        .then((resp) => {    
            //save back the results
            if(resp.status == true) {
                callback(resp.moments)
            }
            else{
                callback(false)
            }
        }))
        .catch(err => callback(false, 0))
    }
}
export {useAuthLogin, authUserSilently, getUserSilently, getMoments}