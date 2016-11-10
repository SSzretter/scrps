module.exports = {
    isPosEqual : function(firstPos,secondPos){
        if(!(firstPos && secondPos)){
            return false
        }
        return firstPos.x === secondPos.x && firstPos.y === secondPos.y && firstPos.roomName === secondPos.roomName
    }
}
