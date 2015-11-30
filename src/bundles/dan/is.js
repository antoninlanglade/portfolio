var userAgent = navigator.userAgent,
    match = function(regex) {
        return userAgent.search(regex) !== -1;
    },
    IS = {
        ie7: match('MSIE 7.0'),
        ie8: match('MSIE 8.0'),
        ie9: match('MSIE 9.0')
    };

IS.ltie9 = IS.ie8 || IS.ie7;
IS.lteie9 = IS.ie9 || IS.ltie9;

export default IS;
export var Is = IS;