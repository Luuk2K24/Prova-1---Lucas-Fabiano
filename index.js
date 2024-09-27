const { createApp } = Vue;

createApp({
    data() {
        return {
            hero: { life: 100, name: "Bonoro", isDefending: false, potionsLeft: 3 },
            villain: { life: 100, name: "9 dedos", isDefending: false, potionsLeft: 3 },
            notification: "",
            gameOver: false,
            gameStarted: false,
            turn: "hero",
            sounds: { 
                hero: new Audio('audios/bolsonaro.m4a'),
                villain: new Audio('audios/lula.m4a'),
                heroVictory: new Audio('audios/vitoria_bolsonaro.mp3'),
                villainVictory: new Audio('audios/vitoria_lula.mp3')
            },
            notificationTimeout: null
        };
    },
    methods: {
        playSound(action) {
            if (this.sounds[action]) {
                this.sounds[action].play();
            }
        },

        showNotification(message, duration = 7000) {
            this.notification = message;
            clearTimeout(this.notificationTimeout);
            this.notificationTimeout = setTimeout(() => {
                this.notification = "";
            }, duration);
        },

        attack(isHero) {
            if (this.gameOver || (isHero && this.turn !== "hero")) return;

            const attacker = isHero ? this.hero : this.villain;
            const defender = isHero ? this.villain : this.hero;

            if (!defender.isDefending) {
                const damage = Math.floor(Math.random() * 50) + 1;
                defender.life -= damage;
                if (defender.life < 0) defender.life = 0; 
                this.showNotification(`${attacker.name} atacou ${defender.name} causando ${damage} de dano.`);
            } else {
                this.showNotification(`${defender.name} defendeu o ataque de ${attacker.name}.`);
            }

            defender.isDefending = false; 

            this.checkGameOver(); 

            if (!this.gameOver && isHero) {
                this.turn = "villain";
                setTimeout(() => this.villainAction(), 2000);
            }
        },
        defense(isHero) {
            if (this.gameOver || (isHero && this.turn !== "hero")) return;

            const defender = isHero ? this.hero : this.villain;
            defender.isDefending = true; 
            this.showNotification(`${defender.name} está se defendendo e não sofrerá dano neste turno.`);

            this.checkGameOver();

            if (!this.gameOver && isHero) {
                this.turn = "villain";
                setTimeout(() => this.villainAction(), 4000);
            }
        },
        usePotion(isHero) {
            if (this.gameOver || (isHero && this.turn !== "hero")) return;

            const character = isHero ? this.hero : this.villain;

            if (character.potionsLeft > 0) {
                const heal = Math.floor(Math.random() * 50) + 1;
                character.life += heal;
                if (character.life > 100) character.life = 100; 
                character.potionsLeft--; 
                this.showNotification(`${character.name} usou uma poção e recuperou ${heal} pontos de vida. Restam ${character.potionsLeft} poções.`);
            } else {
                this.showNotification(`${character.name} não tem mais poções restantes!`);
            }

            this.checkGameOver();

            if (!this.gameOver && isHero) {
                this.turn = "villain";
                setTimeout(() => this.villainAction(), 2000);
            }
        },
        flee(isHero) {
            const character = isHero ? this.hero : this.villain;
            this.showNotification(`${character.name} fugiu da batalha!`);
            this.gameOver = true;
        },
        villainAction() {
            const actions = ['attack', 'defense', 'usePotion'];
            let randomAction = actions[Math.floor(Math.random() * actions.length)];

            if (randomAction === 'usePotion' && this.villain.potionsLeft === 0) {
                do {
                    randomAction = actions[Math.floor(Math.random() * actions.length)];
                } while (randomAction === 'usePotion');
            }

            if (!this.gameOver) {
                setTimeout(() => {
                    if (randomAction === 'attack') {
                        this.attack(false);
                    } else if (randomAction === 'defense') {
                        this.defense(false);
                    } else if (randomAction === 'usePotion') {
                        this.usePotion(false);
                    }
                    this.turn = "hero";
                }, 2000);
            }
        },
        checkGameOver() {
            if (this.hero.life === 0) {
                this.showNotification(`${this.villain.name} venceu a batalha!`);
                this.playSound('villainVictory');
                this.gameOver = true;
            } else if (this.villain.life === 0) {
                this.showNotification(`${this.hero.name} venceu a batalha!`);
                this.playSound('heroVictory');
                this.gameOver = true;
            }
        },
        startGame() {
            this.gameStarted = true;
            this.playSound('hero');

            setTimeout(() => {
                if (!this.gameOver) {
                    this.playSound('villain');
                }
            }, 5000);
        },
        restartGame() {
            this.hero.life = 100;
            this.villain.life = 100;
            this.hero.potionsLeft = 3;
            this.villain.potionsLeft = 3;
            this.hero.isDefending = false;
            this.villain.isDefending = false;
            this.notification = "";
            this.gameOver = false;
            this.turn = "hero";
            this.startGame();
        }
    }
}).mount("#app");
