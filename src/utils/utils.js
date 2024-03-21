/* UTILS FUNCTIONS */

import { s, w } from "./constants";
//change theme
const setTheme = (type = null) => {
    if(type == null) {
        //read theme from local storage
        type = localStorage.getItem('theme_type') || 'white'
    }
    if(type == 'white') {
        s.setProperty('--main-bg', '#F3F6F2');
        s.setProperty('--primary', 'rgb(255 166 44)');
        s.setProperty('--secondary', '#0c0a08');
        s.setProperty('--button', '#fff');
        s.setProperty('--info', 'grey');
    }
    else {
        s.setProperty('--main-bg', '#0c0a08');
        s.setProperty('--primary', 'rgb(255 166 44)');
        s.setProperty('--secondary', '#F3F6F2');
        s.setProperty('--button', '#222');
        s.setProperty('--info', '#aaa');
    }
}
//E operator
const E = (id) => {return document.getElementById(id)}
//retreive auth details
const getLoginDetails = () => {
    const login = localStorage.getItem('moments') || ""
    const loginData = localStorage.getItem('moments_user_data') || "{}"
    if(login !== "") {
        return {login, loginData}
    }
    else {
        return false
    }
}
//to load image
const loadImage = (id, url, type = 1) => {  
    if(url !== undefined) {
        const loadImages = async () => {
            const img = new Image();
            img.onload = () => { 
                if(type == 1) {
                    E(id).src = url
                }
                else {
                    E(id).style.backgroundImage = 'url(' + url + ')'
                }
            };
            img.onerror = async (e) => {  
                //load again if the img tag is present
                if(e.type == 'error' && E(id) != null) {  
                    img.src = ""
                    await new Promise(resolve => setTimeout(resolve, 2000))
                    img.src = url
                }
            };
            img.src = url; 
        };
        loadImages();
    }
}
//to do on render
const onRender = (id, callback) => {
    let n = 0;
    const idx = setInterval(() => {
        if(E(id)) {
            clearInterval(idx)
            callback()
        } 
        if(n > 1E9) {clearInterval(idx)}
        n++
    }, 500)
}
//to listen to body clicks except the target
const bigClick = (elem, callback) => {
    document.body.addEventListener('click', (event) => {
        callback()
    })
} 
//to copy string
const copyLink = (uri) => {
    // Create a temporary input element
    const input = document.createElement('input');
    input.value = uri;
    document.body.appendChild(input);
    // Select and copy the link
    input.select();
    document.execCommand('copy');
    // Remove the temporary input element
    document.body.removeChild(input);
}
//to format numbers for sizes
const fSize = (num) => {
    num *= 1;
    if(num >= 1000 && num < 1000000) {
        return (num/1000) + 'k'
    }
    else if(num >= 1000000 && num < 1000000000) {
        return (num/1000000) + 'M'
    }
    else if(num >= 1000000000) {
        return (num/1000000000) + 'B'
    }
    else {
        return num
    }
}
//Navigations
const B = (viewId, callback = null, backAction = null) => {
    if(!w.NAV) {
        w.NAV = []
        w.B_FORCED = false
        w.B_CURRENT_VIEW = "B_UNKNOWN"
    }
    w.NAV[viewId || "B_UNKNOWN"] = {on:callback, back:backAction}
    w.onpopstate = (event) => {  
        //get current state
        const url = (new URLSearchParams(w.location.href)).get("b") || "B_UNKNOWN"
        if(!w.B_FORCED) {
            if(w.NAV[w.B_CURRENT_VIEW]) {
                if(w.NAV[w.B_CURRENT_VIEW]['back']) {
                    w.NAV[w.B_CURRENT_VIEW]['back']()
                }
            }
            if(w.NAV[url]) {
                if(w.NAV[url]['on']) {w.NAV[url]['on']()}
            }
        }
        w.B_FORCED = false
        w.B_CURRENT_VIEW = url
    }
}
const bGo = (viewId) => {
    const urlObj = new URL(w.location.href);
    const searchParams = new URLSearchParams(urlObj.search);
    let flg = true;
    // Check if the parameter already exists
    if (searchParams.has('B')) {
        //check if its already in the state
        if(searchParams.get('B') == viewId){flg = false}
        // Edit the existing parameter
        searchParams.set('B', viewId);
    } else {
        // Add the new parameter
        searchParams.append('B', viewId);
    }
    // Update the URL with the modified search parameters
    urlObj.search = searchParams.toString();
    w.B_CURRENT_VIEW = viewId
    if(flg) {  
      w.history.pushState(viewId, viewId, urlObj.toString());
    }
}
const bBack = (viewId) => {
    const urlObj = new URL(w.location.href);
    const searchParams = new URLSearchParams(urlObj.search);
    // Check if the parameter already exists
    if (searchParams.has('B')) {
        //check if its already in the state
        if(searchParams.get('B') == viewId){
            //allows going back
            w.B_FORCED = true
            w.history.back()
        }
    }  
}
const cmpDate = (date1, date2) => {
    // Extract day, month, and year components from each date
    const day1 = date1.getDate();
    const month1 = date1.getMonth();
    const year1 = date1.getFullYear();

    const day2 = date2.getDate();
    const month2 = date2.getMonth();
    const year2 = date2.getFullYear();

    // Compare day, month, and year components
    return day1 === day2 && month1 === month2 && year1 === year2;
}
export {setTheme, E, getLoginDetails, loadImage, onRender, bigClick, copyLink, fSize, B, bGo, bBack, cmpDate}