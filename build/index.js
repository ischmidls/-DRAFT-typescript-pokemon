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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var SCALE = 4;
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');
canvas.width = 1024;
canvas.height = 576;
var collisionsMap = [];
for (var i = 0; i < collisions.length; i += 70) {
    collisionsMap.push(collisions.slice(i, 70 + i));
}
var battleZonesMap = [];
for (var i = 0; i < battleZonesData.length; i += 70) {
    battleZonesMap.push(battleZonesData.slice(i, 70 + i));
}
var charactersMap = [];
for (var i = 0; i < charactersMapData.length; i += 70) {
    charactersMap.push(charactersMapData.slice(i, 70 + i));
}
console.log(charactersMap);
var boundaries = [];
var offset = {
    x: -735,
    y: -650
};
collisionsMap.forEach(function (row, i) {
    row.forEach(function (symbol, j) {
        if (symbol === 1025)
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }));
    });
});
var battleZones = [];
battleZonesMap.forEach(function (row, i) {
    row.forEach(function (symbol, j) {
        if (symbol === 1025)
            battleZones.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }));
    });
});
var characters = [];
var villagerImg = new Image();
villagerImg.src = './assets/img/villager/Idle.png';
var oldManImg = new Image();
oldManImg.src = './assets/img/oldMan/Idle.png';
charactersMap.forEach(function (row, i) {
    row.forEach(function (symbol, j) {
        // 1026 === villager
        if (symbol === 1026) {
            characters.push(new Character({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                },
                image: villagerImg,
                frames: {
                    max: 4,
                    hold: 60
                },
                scale: 3,
                animate: true,
                dialogue: ['...', 'Hey mister, have you seen my Doggochu?']
            }));
        }
        // 1031 === oldMan
        else if (symbol === 1031) {
            characters.push(new Character({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                },
                image: oldManImg,
                frames: {
                    max: 4,
                    hold: 60
                },
                scale: 3,
                dialogue: ['My bones hurt.']
            }));
        }
        if (symbol !== 0) {
            boundaries.push(new Boundary({
                position: {
                    x: j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
                }
            }));
        }
    });
});
var image = new Image();
image.src = './assets/img/typeScriptMonMap.png';
var foregroundImage = new Image();
foregroundImage.src = './assets/img/foregroundObjects.png';
var playerDownImage = new Image();
playerDownImage.src = './assets/img/playerDown.png';
var playerUpImage = new Image();
playerUpImage.src = './assets/img/playerUp.png';
var playerLeftImage = new Image();
playerLeftImage.src = './assets/img/playerLeft.png';
var playerRightImage = new Image();
playerRightImage.src = './assets/img/playerRight.png';
var player = new Sprite({
    position: {
        x: canvas.width / 2 - 192 / 4 / 2,
        y: canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max: 4,
        hold: 10
    },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage
    }
});
var background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image
});
var foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: foregroundImage
});
var keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
};
var movables = __spreadArray(__spreadArray(__spreadArray(__spreadArray([
    background
], boundaries, true), [
    foreground
], false), battleZones, true), characters, true);
var renderables = __spreadArray(__spreadArray(__spreadArray(__spreadArray([
    background
], boundaries, true), battleZones, true), characters, true), [
    player,
    foreground
], false);
var battle = {
    initiated: false
};
function animate() {
    var animationId = window.requestAnimationFrame(animate);
    renderables.forEach(function (renderable) {
        renderable.draw();
    });
    var moving = true;
    player.animate = false;
    if (battle.initiated)
        return;
    // activate a battle
    if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
        for (var i = 0; i < battleZones.length; i++) {
            var battleZone = battleZones[i];
            var overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width) -
                Math.max(player.position.x, battleZone.position.x)) *
                (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) -
                    Math.max(player.position.y, battleZone.position.y));
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: battleZone
            }) &&
                overlappingArea > (player.width * player.height) / 2 &&
                Math.random() < 0.01) {
                // deactivate current animation loop
                window.cancelAnimationFrame(animationId);
                audio.Map.stop();
                audio.initBattle.play();
                audio.battle.play();
                battle.initiated = true;
                gsap.to('#overlappingDiv', {
                    opacity: 1,
                    repeat: 3,
                    yoyo: true,
                    duration: 0.4,
                    onComplete: function () {
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            duration: 0.4,
                            onComplete: function () {
                                // activate a new animation loop
                                initBattle();
                                animateBattle();
                                gsap.to('#overlappingDiv', {
                                    opacity: 0,
                                    duration: 0.4
                                });
                            }
                        });
                    }
                });
                break;
            }
        }
    }
    if (keys.w.pressed && lastKey === 'w') {
        player.animate = true;
        player.image = player.sprites.up;
        checkForCharacterCollision({
            characters: characters,
            player: player,
            characterOffset: { x: 0, y: 3 }
        });
        for (var i = 0; i < boundaries.length; i++) {
            var boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: __assign(__assign({}, boundary), { position: {
                        x: boundary.position.x,
                        y: boundary.position.y + 3
                    } })
            })) {
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach(function (movable) {
                movable.position.y += 3;
            });
    }
    else if (keys.a.pressed && lastKey === 'a') {
        player.animate = true;
        player.image = player.sprites.left;
        checkForCharacterCollision({
            characters: characters,
            player: player,
            characterOffset: { x: 3, y: 0 }
        });
        for (var i = 0; i < boundaries.length; i++) {
            var boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: __assign(__assign({}, boundary), { position: {
                        x: boundary.position.x + 3,
                        y: boundary.position.y
                    } })
            })) {
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach(function (movable) {
                movable.position.x += 3;
            });
    }
    else if (keys.s.pressed && lastKey === 's') {
        player.animate = true;
        player.image = player.sprites.down;
        checkForCharacterCollision({
            characters: characters,
            player: player,
            characterOffset: { x: 0, y: -3 }
        });
        for (var i = 0; i < boundaries.length; i++) {
            var boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: __assign(__assign({}, boundary), { position: {
                        x: boundary.position.x,
                        y: boundary.position.y - 3
                    } })
            })) {
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach(function (movable) {
                movable.position.y -= 3;
            });
    }
    else if (keys.d.pressed && lastKey === 'd') {
        player.animate = true;
        player.image = player.sprites.right;
        checkForCharacterCollision({
            characters: characters,
            player: player,
            characterOffset: { x: -3, y: 0 }
        });
        for (var i = 0; i < boundaries.length; i++) {
            var boundary = boundaries[i];
            if (rectangularCollision({
                rectangle1: player,
                rectangle2: __assign(__assign({}, boundary), { position: {
                        x: boundary.position.x - 3,
                        y: boundary.position.y
                    } })
            })) {
                moving = false;
                break;
            }
        }
        if (moving)
            movables.forEach(function (movable) {
                movable.position.x -= 3;
            });
    }
}
// animate()
var lastKey = '';
window.addEventListener('keydown', function (e) {
    if (player.isInteracting) {
        switch (e.key) {
            case ' ':
                player.interactionAsset.dialogueIndex++;
                var _a = player.interactionAsset, dialogueIndex = _a.dialogueIndex, dialogue = _a.dialogue;
                if (dialogueIndex <= dialogue.length - 1) {
                    document.querySelector('#characterDialogueBox').innerHTML =
                        player.interactionAsset.dialogue[dialogueIndex];
                    return;
                }
                // finish conversation
                player.isInteracting = false;
                player.interactionAsset.dialogueIndex = 0;
                document.querySelector('#characterDialogueBox').style.display = 'none';
                break;
        }
        return;
    }
    switch (e.key) {
        case ' ':
            if (!player.interactionAsset)
                return;
            // beginning the conversation
            var firstMessage = player.interactionAsset.dialogue[0];
            document.querySelector('#characterDialogueBox').innerHTML = firstMessage;
            document.querySelector('#characterDialogueBox').style.display = 'flex';
            player.isInteracting = true;
            break;
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
});
window.addEventListener('keyup', function (e) {
    switch (e.key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
});
var clicked = false;
addEventListener('click', function () {
    if (!clicked) {
        audio.Map.play();
        clicked = true;
    }
});
