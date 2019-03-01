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
            hp: 10000,
            ap: 300,
            cap: 4000,
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
                    $(".eselection > #rey").css({"display": "none"});
                }
                else if(pname === "strooper"){
                    player.user.hp = character.strooper.hp;
                    player.user.ap = character.strooper.ap;
                    player.user.iap = character.strooper.ap;
                    $(".eselection > #strooper").css({"display": "none"});
                }
                else if(pname === "yoda"){
                    player.user.hp = character.yoda.hp;
                    player.user.ap = character.yoda.ap;
                    player.user.iap = character.yoda.ap;
                    $(".eselection > #yoda").css({"display": "none"});
                }
                else if(pname === "kylo"){
                    player.user.hp = character.kylo.hp;
                    player.user.ap = character.kylo.ap;
                    player.user.iap = character.kylo.ap;
                    $(".eselection > #kylo").css({"display": "none"});
                }
                else if(pname === "dtrooper"){
                    player.user.hp = character.dtrooper.hp;
                    player.user.ap = character.dtrooper.ap;
                    player.user.iap = character.dtrooper.ap;
                    $(".eselection > #dtrooper").css({"display": "none"});
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
                    $(".eselection > div").css({
                        "pointer-events": "none", 
                        "transition": "1s", 
                        "background-color": "rgba(119, 136, 153, 0.4)"
                    });
                    $("#pattack").css({
                        "transform": "rotateX(0deg)", 
                        "pointer-events": "all"
                    });
                },1000);
                console.log("cpu stats: " + player.cpu);
                game.winstatus = false;
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
            if(player.cpu.hp !== 0){
                let temp = RNG(player.cpu.cap/2);
                player.user.hp = (player.user.hp - temp);
                console.log("The counter attack dealt: "+temp+" damage");
            }
        },
        rounds: 0,
        win: {
            checker: () => {
                if(player.cpu.hp === 0 && game.rounds === 5){
                    game.winstatus = true;
                    game.win.end();
                }
                else if (player.cpu.hp === 0 && player.cpu.name === "vader"){
                    game.winstatus = true;
                    game.win.end();
                }
                else if(player.cpu.hp === 0){
                    $("#pattack").css({"pointer-events": "none"});
                    game.enemySelect();
                    game.defeatedChecker();
                    game.rounds++;
                    game.setPercent();
                    game.setDefeated();
                    console.log("the Player Wins!");
                    game.VADER();
                    DOM.update();
                }
            },
            end: () => {
                if(game.winstatus === true && game.losestatus === false){
                    $(".youwin").fadeIn();
                    $("#percentage").text("WIN!");
                    $("#rnum > h3").text("WINNER!!");
                }
                else{
                    $(".youwin").fadeOut();
                }
            },
        },
        lose: {
            checker: () => {
                if(player.user.hp === 0){
                    game.losestatus = true;
                    $("#pattack").css({"pointer-events": "none"});
                    game.lose.end();
                    game.enemySelect();
                    console.log("the Computer Wins!");
                }
            },
            end: () => {
                if(game.winstatus === false && game.losestatus === true){
                   
                    $("#percentage").html("<h2>LOSE!</h2>");
                    $("#rnum > h3").text("LOSER!!");
                    $(".youlose").fadeIn();
                }
                else{
                    $(".youlose").fadeOut();
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
        defeatedChecker: () => {    
            player.user.defeated[game.rounds] = player.cpu.name;
            for(let i=0; i<3; i++){
                for(let x=0; x<player.user.defeated.length; x++){
                    if(player.user.defeated[x] === "rey"){
                        $("#rey").remove();
                    }
                    else if(player.user.defeated[x] === "strooper"){
                        $("#strooper").remove();
                    }
                    else if(player.user.defeated[x] === "yoda"){
                        $("#yoda").remove();
                    }
                    else if(player.user.defeated[x] === "kylo"){
                        $("#kylo").remove();
                    }
                    else if(player.user.defeated[x] === "dtrooper"){
                        $("#dtrooper").remove();
                    }
                }
            }
        },
        setDefeated: () => {
            $("#defeated").append("<div id = 'defeated" + game.rounds + "'></div>");
            $("#defeated"+game.rounds).css({
                "content": "url('img/smallsize/"+player.cpu.name+"-small.png')",
                "width": "60%",
                "margin": "0 auto"
            });
        },
        winstatus: false,
        losestatus: false,
        percentage: 0,
        setPercent: () => {
            game.percentage =  Math.floor((game.rounds / 4) * 100); 
        },
        VADER: () => {
            if(player.user.defeated.length === 4){
                game.set.cpu("vader");
                player.cpu.name = "vader";
                game.percentage = "ITS DARTH VADER!!!";
                DOM.update();
                $("#rnum > h3").html("BONUS ROUND!!!!!")
            }
        },
    };
    let DOM = {
        update: () => {
            $("#ppic").css({"content": "url('img/smallsize/"+player.user.name+"-small.png')"});
            $("#cpic").css({"content": "url('img/smallsize/"+player.cpu.name+"-small.png')"});
            $("#pstat").html("<p>Stats:</p><p>HP: " + player.user.hp + "</p><p>Attack: " + player.user.ap + "</p>");
            $("#cstat").html("<p>Stats:</p><p>HP: " + player.cpu.hp + "</p><p>Attack: " + player.cpu.cap + "</p>");
            if(player.cpu.name === "vader"){
                $("#percentage").text(game.percentage);
            }
            else{
                $("#rnum > h3").text("Round " + (game.rounds+1));
                $("#percentage").text(game.percentage + "%");
            }

        },
        reset: () => {
            location.reload();  
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
        if(game.winstatus === false && player.cpu.name !== "vader"){
            console.log("GAME WINSTATUS IS TRUE");
            game.counterAttack();
        }
        else if(player.cpu.name === "vader"){
            // console.log("COUNTER ATTACK FOR VADER ");
            // game.counterAttack();
        }
        game.zero();
        game.lose.checker();
        DOM.update();
        DOM.update();
    });
    $(".youwin").on("click", () => {
        console.log("WIN CLICK HAPPENED");
        DOM.reset();
    });
    $(".youlose").on("click", () => {
        console.log("LOSE CLICK HAPPENED");
        DOM.reset();
    });



});