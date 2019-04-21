Array.prototype.find = function (x) {
    for(var i = 0; i< this.length; i++){
        if(typeof x === "function"){
            if(x(this[i])){
                return this[i];
            }
        }else{
            if(x==this[i]){
                return this[i];
            }
        }
    }
    return null;    
};