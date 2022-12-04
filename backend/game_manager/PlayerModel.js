class PlayerModel {
    constructor(socketId) {

        this.id = socketId;
        [this.x, this.y] = [100,200]  ;
    }

}

module.exports = PlayerModel
