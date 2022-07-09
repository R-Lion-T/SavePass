export function passwordCheck(password) {
    if(!password.length) return "";
    let s_letters = "qwertyuiopasdfghjklzxcvbnm", //буквы нижнего регистра
        b_letters = "QWERTYUIOPASDFGHJKLZXCVBNM", //буквы нижнего регистра
        digits = "1234567890", //цифры
        specials = "!@#$%^&*()_-+=\|/.,:;[]{}", // Специальные символы
        i_sl = false, //Логическая переменная, наличие в пароле букв нижнего регистра
        i_bl = false, //Наличие в пароле букв верхнего регистра
        i_d = false, //Наличие в пароле цифр
        i_sp = false; //Наличие в пароле специальных символов

    for (let i = 0; i < password.length; i++) { //Цикл, в котором последовательно проверяется каждый символ в пароле, в результате которого определяется, присутствуют ли в пароле определенные символы.
        if (!i_sl && s_letters.indexOf(password[i]) != -1) i_sl = true;
        else if (!i_bl && b_letters.indexOf(password[i]) != -1) i_bl = true;
        else if (!i_d && digits.indexOf(password[i]) != -1) i_d = true;
        else if (!i_sp && specials.indexOf(password[i]) != -1) i_sp = true;
    }
    let rating = 0,
        status = "";

    if (i_sl) rating++; // Если в пароле есть буквы нижнего регистра, его параметр сложности увеличивается
    if (i_bl) rating++; // Если в пароле есть буквы верхнего регистра, его параметр сложности увеличивается
    if (i_d) rating++; // Если в пароле есть цифры, его параметр сложности увеличивается
    if (i_sp) rating++; // Если в пароле есть специальные символы, его параметр сложности увеличивается

    // Затем происходит анализ длины пароля и вычисленного ранее параметра сложности, на основании которых пользователь получает текстовую оценку сложности пароля

    if (password.length < 6 && rating < 3) status = "weak";
    else if (password.length < 6 && rating >= 3) status = "average";
    else if (password.length >= 8 && rating < 3) status = "average";
    else if (password.length >= 8 && rating >= 3) status = "high";
    else if (password.length >= 6 && rating == 1) status = "weak";
    else if (password.length >= 6 && rating > 1 && rating < 4) status = "average";
    else if (password.length >= 6 && rating == 4) status = "high"
  
    return status;
}

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