var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
function rectangularCollision(_a) {
    var rectangle1 = _a.rectangle1, rectangle2 = _a.rectangle2;
    return (rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
        rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
        rectangle1.position.y + rectangle1.height >= rectangle2.position.y);
}
function checkForCharacterCollision(_a) {
    var characters = _a.characters, player = _a.player, _b = _a.characterOffset, characterOffset = _b === void 0 ? { x: 0, y: 0 } : _b;
    player.interactionAsset = null;
    // monitor for character collision
    for (var i = 0; i < characters.length; i++) {
        var character = characters[i];
        if (rectangularCollision({
            rectangle1: player,
            rectangle2: __assign(__assign({}, character), { position: {
                    x: character.position.x + characterOffset.x,
                    y: character.position.y + characterOffset.y
                } })
        })) {
            player.interactionAsset = character;
            break;
        }
    }
}
