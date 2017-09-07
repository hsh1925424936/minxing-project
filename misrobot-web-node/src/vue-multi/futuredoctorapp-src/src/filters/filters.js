/**
 * Created by liuchuanyang on 2017/3/21.
 */
export const substr = (str, start, len) => {
    if(str && typeof str === 'string') {
        return "".substr.call(str, start, len);
    }
    return str;
}

export const substring = (str, start, end) => {
    if(str && typeof str === 'string') {
        return "".substring.call(str, start, end);
    }
    
    return str;
}
