$("document").ready(function() {

    //Global Functions
    let RNG = (x) => {
        let temp = Math.floor(Math.random()*Math.abs(Math.floor(x)));
        return temp;
    }

    //Character object
    let character = {
        rey: {
            hp: 80,
            ap: 100,
            cap: 180,
            iap: 0
        },
        strooper: {
            hp: 100,
            ap: 80,
            cap: 100,
            iap: 0
        },
        yoda: {
            hp: 30,
            ap: 150,
            cap: 220,
            iap: 0
        },
        kylo: {
            hp: 70,
            ap: 120,
            cap: 190,
            iap: 0
        },
        dtrooper: {
            hp: 100,
            ap: 100,
            cap: 140,
            iap: 0
        },
        vader: {
            hp: 300,
            ap: 300,
            cap: 400,
            iap: 0
        },
    };
    let player = {
        user: {
            hp: 0,
            ap: 0,
            iap: 0,
            defeated: [],
            name: '',
        },
        cpu: {
            hp: 0,
            cap: 0,
            name: '',
            reset: () => {
                player.cpu.hp = 0;
                player.cpu.cap = 0;
            },
        },
    };
    let game = {
        set: {
            player: (e) => {
                let pname = $(e.target).attr('id');
                if(pname === "rey"){
                    player.user.hp = character.rey.hp;
                    player.user.ap = character.rey.ap;
                    player.user.iap = character.rey.ap;
                }
                else if(pname === "strooper"){
                    player.user.hp = character.strooper.hp;
                    player.user.ap = character.strooper.ap;
                    player.user.iap = character.strooper.ap;
                }
                else if(pname === "yoda"){
                    player.user.hp = character.yoda.hp;
                    player.user.ap = character.yoda.ap;
                    player.user.iap = character.yoda.ap;
                }
                else if(pname === "kylo"){
                    player.user.hp = character.kylo.hp;
                    player.user.ap = character.kylo.ap;
                    player.user.iap = character.kylo.ap;
                }
                else if(pname === "dtrooper"){
                    player.user.hp = character.dtrooper.hp;
                    player.user.ap = character.dtrooper.ap;
                    player.user.iap = character.dtrooper.ap;
                }
                else{
                    player.user.hp = character.vader.hp;
                    player.user.ap = character.vader.ap;
                    player.user.iap = character.vader.ap;
                }
                player.user.name = pname;
                $(".pselection").fadeOut();
                setTimeout(() => {
                    $(".eselection").fadeIn();
                    $(".eselection").css("display","grid");
                    },1000);
                console.log("user stats: " + player.user);
            },
            cpu: (e) => {
                let pname = $(e.target).attr('id');
                if(pname === "rey"){
                    player.cpu.hp = character.rey.hp;
                    player.cpu.cap = character.rey.cap;
                }
                else if(pname === "strooper"){
                    player.cpu.hp = character.strooper.hp;
                    player.cpu.cap = character.strooper.cap;
                }
                else if(pname === "yoda"){
                    player.cpu.hp = character.yoda.hp;
                    player.cpu.cap = character.yoda.cap;
                }
                else if(pname === "kylo"){
                    player.cpu.hp = character.kylo.hp;
                    player.cpu.cap = character.kylo.cap;
                }
                else if(pname === "dtrooper"){
                    player.cpu.hp = character.dtrooper.hp;
                    player.cpu.cap = character.dtrooper.cap;
                }
                else{
                    player.cpu.hp = character.vader.hp;
                    player.cpu.cap = character.vader.cap;
                }
                player.cpu.name = pname;
                setTimeout(() => {
                    $(".eselection > div").css({"pointer-events": "none", "transition": "1s", "background-color": "rgba(119, 136, 153, 0.4)"});
                    $("#pattack").css({"transform": "rotateX(0deg)", "pointer-events": "all"});
                },1000);
                console.log("cpu stats: " + player.cpu);
            },
        },
        attack: () => {
            let temp = RNG(player.user.iap);
            player.cpu.hp = (player.cpu.hp - temp);
            player.user.iap = player.user.iap + (player.user.ap/2);
            console.log("The attack dealt: "+temp+" damage");
            console.log(player.user.name + "has a new AP of " + player.user.iap);
        },
        counterAttack: () => {
            let temp = RNG(player.cpu.cap/3);
            player.user.hp = (player.user.hp - temp);
            console.log("The counter attack dealt: "+temp+" damage");
        },
        rounds: 0,
        win: {
            checker: () => {
                if(player.cpu.hp === 0){
                    $("#pattack").css({"pointer-events": "none"});
                    game.enemySelect();
                    game.rounds++;
                    game.setDefeated();
                    console.log("the Player Wins!");
                }
            },
            celebrate: () => {

            },
        },
        lose: {
            checker: () => {
                if(player.user.hp === 0){
                    $("#pattack").css({"pointer-events": "none"});
                    game.enemySelect();
                    console.log("the Computer Wins!");
                }
            },
        },
        zero: () => {
            if(player.user.hp < 0){
                player.user.hp = 0;
            }
            if(player.cpu.hp < 0){
                player.cpu.hp = 0;
            }
        },
        enemySelect: () => {
            $(".eselection > div").css({
                "pointer-events": "all",
                "transition": "1s", 
                "background-color": "rgba(112, 0, 0, 0.4)"
            });
            $("#pattack").css({
                "transform": "rotateX(180deg)",
                "pointer-events": "none"
            });
        },
        setDefeated: () => {
            $("#defeated").append("<div id = 'defeated" + game.rounds + "'></div>");
            $("#defeated"+game.rounds).css({
                "content": "url('img/smallsize/"+player.cpu.name+"-small.png')",
                "width": "60%",
                "margin": "0 auto"
            });
        },
        result: () => {

        },
    };
    let DOM = {
        update: () => {
            $("#ppic").css({"content": "url('img/smallsize/"+player.user.name+"-small.png')"});
            $("#cpic").css({"content": "url('img/smallsize/"+player.cpu.name+"-small.png')"});
            $("#pstat").html("<p>Stats:</p><p>HP: " + player.user.hp + "</p><p>Attack: " + player.user.ap + "</p>");
            $("#cstat").html("<p>Stats:</p><p>HP: " + player.cpu.hp + "</p><p>Attack: " + player.cpu.cap + "</p>");
            $("#rnum > h3").text("Round " + (game.rounds+1));
        },
    };


    //=================================================================================
    //Test Center

    




    //=================================================================================
    //=================================================================================
    //Click Events
    $(".pselection > div").on("click", (e) => {
        game.set.player(e);
        DOM.update();
    });
    $(".eselection > div").on("click", (e) => {
        game.set.cpu(e);
        DOM.update();
    });
    $("#pattack").on("click", () => {
        game.attack();
        game.zero();
        game.win.checker();
        game.lose.checker();
        game.counterAttack();
        game.zero();
        DOM.update();
    });



});