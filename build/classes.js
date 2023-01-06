var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Sprite = /** @class */ (function () {
    function Sprite(_a) {
        var position = _a.position, velocity = _a.velocity, image = _a.image, _b = _a.frames, frames = _b === void 0 ? { max: 1, hold: 10 } : _b, sprites = _a.sprites, _c = _a.animate, animate = _c === void 0 ? false : _c, _d = _a.rotation, rotation = _d === void 0 ? 0 : _d, _e = _a.scale, scale = _e === void 0 ? 1 : _e;
        var _this = this;
        this.position = position;
        this.image = new Image();
        this.frames = __assign(__assign({}, frames), { val: 0, elapsed: 0 });
        this.image.onload = function () {
            _this.width = (_this.image.width / _this.frames.max) * scale;
            _this.height = _this.image.height * scale;
        };
        this.image.src = image.src;
        this.animate = animate;
        this.sprites = sprites;
        this.opacity = 1;
        this.rotation = rotation;
        this.scale = scale;
    }
    Sprite.prototype.draw = function () {
        c.save();
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
        c.rotate(this.rotation);
        c.translate(-this.position.x - this.width / 2, -this.position.y - this.height / 2);
        c.globalAlpha = this.opacity;
        var crop = {
            position: {
                x: this.frames.val * (this.width / this.scale),
                y: 0
            },
            width: this.image.width / this.frames.max,
            height: this.image.height
        };
        var image = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: this.image.width / this.frames.max,
            height: this.image.height
        };
        c.drawImage(this.image, crop.position.x, crop.position.y, crop.width, crop.height, image.position.x, image.position.y, image.width * this.scale, image.height * this.scale);
        c.restore();
        if (!this.animate)
            return;
        if (this.frames.max > 1) {
            this.frames.elapsed++;
        }
        if (this.frames.elapsed % this.frames.hold === 0) {
            if (this.frames.val < this.frames.max - 1)
                this.frames.val++;
            else
                this.frames.val = 0;
        }
    };
    return Sprite;
}());
var Monster = /** @class */ (function (_super) {
    __extends(Monster, _super);
    function Monster(_a) {
        var position = _a.position, velocity = _a.velocity, image = _a.image, _b = _a.frames, frames = _b === void 0 ? { max: 1, hold: 10 } : _b, sprites = _a.sprites, _c = _a.animate, animate = _c === void 0 ? false : _c, _d = _a.rotation, rotation = _d === void 0 ? 0 : _d, _e = _a.isEnemy, isEnemy = _e === void 0 ? false : _e, name = _a.name, attacks = _a.attacks;
        var _this = _super.call(this, {
            position: position,
            velocity: velocity,
            image: image,
            frames: frames,
            sprites: sprites,
            animate: animate,
            rotation: rotation
        }) || this;
        _this.health = 100;
        _this.isEnemy = isEnemy;
        _this.name = name;
        _this.attacks = attacks;
        return _this;
    }
    Monster.prototype.faint = function () {
        document.querySelector('#dialogueBox').innerHTML = this.name + ' fainted!';
        gsap.to(this.position, {
            y: this.position.y + 20
        });
        gsap.to(this, {
            opacity: 0
        });
        audio.battle.stop();
        audio.victory.play();
    };
    Monster.prototype.attack = function (_a) {
        var attack = _a.attack, recipient = _a.recipient, renderedSprites = _a.renderedSprites;
        document.querySelector('#dialogueBox').style.display = 'block';
        document.querySelector('#dialogueBox').innerHTML =
            this.name + ' used ' + attack.name;
        var healthBar = '#enemyHealthBar';
        if (this.isEnemy)
            healthBar = '#playerHealthBar';
        var rotation = 1;
        if (this.isEnemy)
            rotation = -2.2;
        recipient.health -= attack.damage;
        switch (attack.name) {
            case 'Fireball':
                audio.initFireball.play();
                var fireballImage = new Image();
                fireballImage.src = './img/fireball.png';
                var fireball = new Sprite({
                    position: {
                        x: this.position.x,
                        y: this.position.y
                    },
                    image: fireballImage,
                    frames: {
                        max: 4,
                        hold: 10
                    },
                    animate: true,
                    rotation: rotation
                });
                renderedSprites.splice(1, 0, fireball);
                gsap.to(fireball.position, {
                    x: recipient.position.x,
                    y: recipient.position.y,
                    onComplete: function () {
                        // Enemy actually gets hit
                        audio.fireballHit.play();
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        });
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        });
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        });
                        renderedSprites.splice(1, 1);
                    }
                });
                break;
            case 'Tackle':
                var tl = gsap.timeline();
                var movementDistance = 20;
                if (this.isEnemy)
                    movementDistance = -20;
                tl.to(this.position, {
                    x: this.position.x - movementDistance
                })
                    .to(this.position, {
                    x: this.position.x + movementDistance * 2,
                    duration: 0.1,
                    onComplete: function () {
                        // Enemy actually gets hit
                        audio.tackleHit.play();
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        });
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        });
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        });
                    }
                })
                    .to(this.position, {
                    x: this.position.x
                });
                break;
        }
    };
    return Monster;
}(Sprite));
var Boundary = /** @class */ (function () {
    function Boundary(_a) {
        var position = _a.position;
        this.position = position;
        this.width = 48;
        this.height = 48;
    }
    Boundary.prototype.draw = function () {
        c.fillStyle = 'rgba(255, 0, 0, 0)';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    };
    Boundary.width = 48;
    Boundary.height = 48;
    return Boundary;
}());
var Character = /** @class */ (function (_super) {
    __extends(Character, _super);
    function Character(_a) {
        var position = _a.position, velocity = _a.velocity, image = _a.image, _b = _a.frames, frames = _b === void 0 ? { max: 1, hold: 10 } : _b, sprites = _a.sprites, _c = _a.animate, animate = _c === void 0 ? false : _c, _d = _a.rotation, rotation = _d === void 0 ? 0 : _d, _e = _a.scale, scale = _e === void 0 ? 1 : _e, _f = _a.dialogue, dialogue = _f === void 0 ? [''] : _f;
        var _this = _super.call(this, {
            position: position,
            velocity: velocity,
            image: image,
            frames: frames,
            sprites: sprites,
            animate: animate,
            rotation: rotation,
            scale: scale
        }) || this;
        _this.dialogue = dialogue;
        _this.dialogueIndex = 0;
        return _this;
    }
    return Character;
}(Sprite));
