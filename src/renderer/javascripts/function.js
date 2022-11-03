export function isValidUrl(url){
    url = url.replace(/\s/g, '')
    if(!url.length) return "";
    const result = /^(http[s]?:\/\/){1}[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g.test(url);
    if(result) return url;
    else return ""
}

export function uniquePassword(password,array,id=null){
   return !!array.filter(item=>{
       if(id){
            if(Number(item.id)!==Number(id)){
                return item.password===password
            }
            return false
       }else{
         return item.password===password
       }
   }).length
}