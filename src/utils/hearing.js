import { w } from "./constants";

/* A Custom hearing object to
   listen and pass state changes
*/
w.hearingHooks = [];

export const setUp = () => {
    //to register hearing
    w.hear = (changeName = "", callback) => { 
        if(!w.hearingHooks[changeName]){w.hearingHooks[changeName] = {callback:[], name:[]}} //intializing
        if(!w.hearingHooks[changeName]['name'].includes(callback.toString())){
            w.hearingHooks[changeName]['callback'].push(callback)
            w.hearingHooks[changeName]['name'].push(callback.toString())
            return w.hearingHooks[changeName].length - 1;
        }
        else {
            //replace
            const indx = w.hearingHooks[changeName]['name'].indexOf(callback.toString())
            w.hearingHooks[changeName]['callback'][indx] = callback
            w.hearingHooks[changeName]['name'][indx] = callback.toString()
            return indx;
        }
    }
    //to speak
    w.speak = (changeName, value) => {
        if(w.hearingHooks[changeName]) {
            for(let i=0;i<w.hearingHooks[changeName]['callback'].length;i++) {
                if(w.hearingHooks[changeName]['callback'][i]) {
                    if(typeof(w.hearingHooks[changeName]['callback'][i]) == typeof(()=>{})) {
                        w.hearingHooks[changeName]['callback'][i](value)
                    }
                }
            }
        }
    }
    //to stop hearing
    w.stopHearing =  (id=null, changeName) => {
        if(id != null && w.hearingHooks[changeName]) {
            w.hearingHooks[changeName][id] = null
        }
    }  
}