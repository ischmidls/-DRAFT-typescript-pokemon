var battleBackgroundImage = new Image();
battleBackgroundImage.src = './img/battleBackground.png';
var battleBackground = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    image: battleBackgroundImage
});
var draggle;
var emby;
var renderedSprites;
var battleAnimationId;
var queue;
function initBattle() {
    document.querySelector('#userInterface').style.display = 'block';
    document.querySelector('#dialogueBox').style.display = 'none';
    document.querySelector('#enemyHealthBar').style.width = '100%';
    document.querySelector('#playerHealthBar').style.width = '100%';
    document.querySelector('#attacksBox').replaceChildren();
    draggle = new Monster(monsters.Draggle);
    emby = new Monster(monsters.Emby);
    renderedSprites = [draggle, emby];
    queue = [];
    emby.attacks.forEach(function (attack) {
        var button = document.createElement('button');
        button.innerHTML = attack.name;
        document.querySelector('#attacksBox').append(button);
    });
    // our event listeners for our buttons (attack)
    document.querySelectorAll('button').forEach(function (button) {
        button.addEventListener('click', function (e) {
            var selectedAttack = attacks[e.currentTarget.innerHTML];
            emby.attack({
                attack: selectedAttack,
                recipient: draggle,
                renderedSprites: renderedSprites
            });
            if (draggle.health <= 0) {
                queue.push(function () {
                    draggle.faint();
                });
                queue.push(function () {
                    // fade back to black
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        onComplete: function () {
                            cancelAnimationFrame(battleAnimationId);
                            animate();
                            document.querySelector('#userInterface').style.display = 'none';
                            gsap.to('#overlappingDiv', {
                                opacity: 0
                            });
                            battle.initiated = false;
                            audio.Map.play();
                        }
                    });
                });
            }
            // draggle or enemy attacks right here
            var randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];
            queue.push(function () {
                draggle.attack({
                    attack: randomAttack,
                    recipient: emby,
                    renderedSprites: renderedSprites
                });
                if (emby.health <= 0) {
                    queue.push(function () {
                        emby.faint();
                    });
                    queue.push(function () {
                        // fade back to black
                        gsap.to('#overlappingDiv', {
                            opacity: 1,
                            onComplete: function () {
                                cancelAnimationFrame(battleAnimationId);
                                animate();
                                document.querySelector('#userInterface').style.display = 'none';
                                gsap.to('#overlappingDiv', {
                                    opacity: 0
                                });
                                battle.initiated = false;
                                audio.Map.play();
                            }
                        });
                    });
                }
            });
        });
        button.addEventListener('mouseenter', function (e) {
            var selectedAttack = attacks[e.currentTarget.innerHTML];
            document.querySelector('#attackType').innerHTML = selectedAttack.type;
            document.querySelector('#attackType').style.color = selectedAttack.color;
        });
    });
}
function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle);
    battleBackground.draw();
    console.log(battleAnimationId);
    renderedSprites.forEach(function (sprite) {
        sprite.draw();
    });
}
animate();
// initBattle()
// animateBattle()
document.querySelector('#dialogueBox').addEventListener('click', function (e) {
    if (queue.length > 0) {
        queue[0]();
        queue.shift();
    }
    else
        e.currentTarget.style.display = 'none';
});
