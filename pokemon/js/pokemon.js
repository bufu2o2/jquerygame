$("document").ready(function(){
//===============================================================
//Global Variables
let selectedCharacter = [];
let enemyArray = [];
let selectedEnemy = [];
let atkDamage;
let espd;
let pspd;
let pchit = 0;
let echit = 0;
let plevel = 1;
let elevel = 1;
let lvl, hp, atk, def, sa, sd, s, c, t;


//===============================================================
//Global Function

//random number generator
let RNG = (x) => {
    let rando = Math.floor(Math.random()*Math.floor(x));
    return rando;
};

//random phrase generator
let PG = () => {
    let phrases = [
        "WOW! ",
        "OOOOOOOOOOO ",
        "AHHHHHHHHH",
        "YIKES! ",
        "OUCH! ",
        "I CAN'T LOOK ",
        "NO WAY!!! ",
        "EEEEEKKKKK!!! ",
        "BLAMO! ",
    ];
    let comment = phrases[RNG(phrases.length)];
    return comment;
};
let speedLogic = () => {
    if(pspd > espd){
        console.log("this is pspd in spd logic:    "+pspd);
        pspd = (pspd - 10 - RNG(5));
        return "player";
    }
    else if(pspd < espd) {
        console.log("this is espd in spd logic:    "+espd);
        espd = (espd - 10 - RNG(5));
        return "enemy";
    }
    else{
        return "miss";
    }
}
//===============================================================
//Click Functions

//select your character
$(".characters > button").on("click", function(){
    // console.log($(this).attr("class"));
    selectedCharacter = $(this).attr("class");
    // console.log(selectedCharacter);
    selectedCharacter = game.setStats(selectedCharacter);
    // console.log(selectedCharacter);
    enemy.res();
    //sets stats based on level
    console.log("This is user stats before Leveler:     " + selectedCharacter);
    console.log("This is enemy stats before Leveler:     " + selectedEnemy);
    user.leveler();
    enemy.leveler();
    console.log("This is user stats after Leveler:     " + selectedCharacter);
    console.log("This is enemy stats after Leveler:     " + selectedEnemy);
    //set the characters speed variable
    pspd = selectedCharacter[7]; 
    espd = selectedEnemy[7];
    //transition to battle mode
    game.setBattleMode(selectedCharacter,selectedEnemy);
});

//battle mode buttons
$(".actionBtn > li > button").on("click", function(){
    let enemyActionArray = ["attack", "special", "defend"];
    // console.log($(this).attr("id"));
    let playerAction = $(this).attr("id");
    let enemyAction = enemyActionArray[RNG(enemyActionArray.length)];
    game.firstHit(playerAction, enemyAction);
    console.log("these are the speeds of the player: "+pspd);
    console.log("these are the speeds of the cpu: "+espd);
    //disables button clicks for 2 seconds
    game.delay(".btnVS", 1600);
    game.winChecker(selectedCharacter, selectedEnemy);
    game.lossChecker(selectedCharacter, selectedEnemy);
});

//win/loss button to reset game
$(".wldiv").on("click", function(){
    console.log("winner button pressed");
    game.reset();
});

//===============================================================
//Test Area


//===============================================================
//Player Object
let user = {
    update: () => {
        $("#lvl").text("Level: "+selectedCharacter[1]);
        $("#hp").text("HP: "+ Math.max(0,selectedCharacter[2]));
        $("#atk").text("Attack: "+selectedCharacter[3]);
        $("#def").text("Defense: "+selectedCharacter[4]);
        $("#sa").text("Special Attack: "+selectedCharacter[5]);
        $("#sd").text("Special Defense: "+selectedCharacter[6]);
        $("#s").text("Speed: "+selectedCharacter[7]);
    },
    turn: (player) => {
        if(player === "attack"){
            atkDamage = (pchit + Math.max(0,(Math.floor(((selectedCharacter[3] + RNG(selectedCharacter[1])+1) - (selectedEnemy[4] + RNG(selectedEnemy[1]+1)))/2))));
            selectedEnemy[2] =  Math.max(0,selectedEnemy[2] - atkDamage);
            animation.pattack();
            setTimeout(() => {
                enemy.update();
                $(".commentary").css("font-size", "25px");
                $(".commentary").text(PG() + " " + selectedCharacter[0] + " just did a "+ player +" on "+ selectedEnemy[0] +" and delivered "+ atkDamage +" damage bringing him to " +selectedEnemy[2] + "HP!!")
            }, 800);
        }
        else if(player === "special"){
            atkDamage = (pchit + Math.max(0,(Math.floor(((selectedCharacter[5] + RNG(selectedCharacter[1])+1) - (selectedEnemy[6] + RNG(selectedEnemy[1]+1)))/2))));
            selectedEnemy[2] =  Math.max(0,selectedEnemy[2] - atkDamage);
            animation.pspecial();
            setTimeout(() => {
                enemy.update();
                $(".commentary").css("font-size", "25px");
                $(".commentary").text(PG() + " " + selectedCharacter[0] + " just did a "+ player +" on "+ selectedEnemy[0] +" and delivered "+ atkDamage +" damage bringing him to " +selectedEnemy[2] + "HP!!")
            }, 800);
        }
        else if(player === "defend"){
            let randBoostIndex = (RNG(5) + 3);
            let randBoost = (selectedCharacter[randBoostIndex] + RNG(5));
            console.log("this is the randBoost:     " +(randBoost-selectedCharacter[randBoostIndex]));
            selectedCharacter[randBoostIndex] = randBoost;
            animation.pdefend();
            setTimeout(() => {
                user.update();
                $(".commentary").css("font-size", "25px");
                $(".commentary").text(PG() + " " + selectedCharacter[0] + " just did a "+ player +" against "+ selectedEnemy[0] +" and boosted himself to "+ randBoost +" points!!");
            }, 800);
        }
        else{
            console.log("error");
        }
    },
    miss: (player) => {
            pspd = (pspd - 10);
            animation.pmiss();
            setTimeout(() => {
                user.update();
                $(".commentary").css("font-size", "25px");
                $(".commentary").text(PG() + " " + selectedCharacter[0] + " just did a "+ player +" on "+ selectedEnemy[0] +" and missed! "+ selectedEnemy[0] + " still has " +selectedEnemy[2] + "HP!!");
            }, 800);
    },
    leveler: () => {
        if(selectedCharacter[1] > 1){
            for(i=2; i<selectedCharacter.length-2; i++){
                selectedCharacter[i] = (RNG(plevel) + selectedCharacter[i]);
            }
        }   
    },
};





//===============================================================
//Enemy Object
let enemy = {
    res: () => {
        selectedEnemy = game.setStats(enemyArray[RNG(enemyArray.length)]);
        selectedEnemy[1] = elevel;
        console.log("the challenger is "+selectedEnemy);
    },
    update: () => {
        $("#elvl").text("Level: "+selectedEnemy[1]);
        $("#ehp").text("HP: "+ Math.max(0,selectedEnemy[2]));
        $("#eatk").text("Attack: "+selectedEnemy[3]);
        $("#edef").text("Defense: "+selectedEnemy[4]);
        $("#esa").text("Special Attack: "+selectedEnemy[5]);
        $("#esd").text("Special Defense: "+selectedEnemy[6]);
        $("#es").text("Speed: "+selectedEnemy[7]);
        $(".bmEnemy").css('background-color', selectedEnemy[8]);
        $(".bmeStats, #epmon").css('color', selectedEnemy[9]);
    },
    turn: (cpu) => {
        if(cpu === "attack"){
            atkDamage = (echit + Math.max(0,(Math.floor(((selectedEnemy[3] + RNG(selectedEnemy[1])+1) - (selectedCharacter[4] + RNG(selectedCharacter[1]+1)))/2))));
            console.log("echit is : " +echit);
            console.log("atkDamage is : " +atkDamage);
            selectedCharacter[2] =  Math.max(0,selectedCharacter[2] - atkDamage);
            animation.eattack();
            setTimeout(() => {
                user.update();
                $(".commentary").css("font-size", "25px");
                $(".commentary").text(PG() + " " + selectedEnemy[0] + " just did a "+ cpu +" on "+ selectedCharacter[0] +" and delivered "+ atkDamage +" damage bringing him to " +selectedCharacter[2] + "HP!!")
            }, 800);
        }
        else if(cpu === "special"){
            atkDamage = (echit + Math.max(0,(Math.floor(((selectedEnemy[5] + RNG(selectedEnemy[1])+1) - (selectedCharacter[6] + RNG(selectedCharacter[1]+1)))/2))));
            selectedCharacter[2] =  Math.max(0,selectedCharacter[2] - atkDamage);
            animation.especial();
            setTimeout(() => {
                user.update();
                $(".commentary").css("font-size", "25px");
                $(".commentary").text(PG() + " " + selectedEnemy[0] + " just did a "+ cpu +" on "+ selectedCharacter[0] +" and delivered "+ atkDamage +" damage bringing him to " +selectedCharacter[2] + "HP!!")
            }, 800);
        }
        else if(cpu === "defend"){
            let randBoostIndex = (RNG(5) + 3);
            let randBoost = (selectedEnemy[randBoostIndex] + RNG(5));
            selectedEnemy[randBoostIndex] = randBoost;
            animation.edefend();
            setTimeout(() => {
                enemy.update();
                $(".commentary").css("font-size", "25px");
                $(".commentary").text(PG() + " " + selectedEnemy[0] + " just did a "+ cpu +" against "+ selectedCharacter[0] +" and boosted himself to "+ randBoost +" points!!");
            });
        }
        else{
            console.log("error");
        }
    },
    miss: (cpu) => {
        espd = (espd - 10);
        animation.emiss();
        setTimeout(() => {
            enemy.update();
            $(".commentary").css("font-size", "25px");
            $(".commentary").text(PG() + " " + selectedEnemy[0] + " just did a "+ cpu +" on "+ selectedCharacter[0] +" and missed! "+ selectedCharacter[0] + " still has " +selectedCharacter[2] + "HP!!");
        }, 800);
    },
    leveler: () => {
        if(selectedEnemy[1] > 1){
            for(i=2; i<selectedEnemy.length-2; i++){
                selectedEnemy[i] = RNG(elevel) + selectedEnemy[i];
            }
        }
    },
};




//===============================================================
//Game Object
let game = {
    setStats: function(character){
        switch (character) {
            case "Pikachu":
                lvl = plevel;
                hp = 20;
                atk = 30;
                def = 20;
                sa = 20;
                sd = 20;
                s = 50;
                c = "lightgoldenrodyellow";
                t = "black";
                character = ([character, lvl, hp, atk, def, sa, sd, s, c, t]);
                // console.log(character);
                enemyArray = ["Squirtle", "Bulbasaur", "Charmander"];
                // console.log(enemyArray);
                return character;
            case "Bulbasaur":
                lvl = plevel;
                hp = 20;
                atk = 30;
                def = 20;
                sa = 30;
                sd = 30;
                s = 30;
                c = "darkgreen";
                t = "white";
                character = ([character, lvl, hp, atk, def, sa, sd, s, c, t]);
                // console.log(character);
                enemyArray = ["Squirtle", "Pikachu", "Charmander"];
                // console.log(enemyArray);
                return character;
            case "Squirtle":
                lvl = plevel;
                hp = 20;
                atk = 30;
                def = 30;
                sa = 20;
                sd = 30;
                s = 20;
                c = "lightskyblue";
                t = "white";
                character = ([character, lvl, hp, atk, def, sa, sd, s, c, t]);
                // console.log(character);
                enemyArray = ["Pikachu", "Bulbasaur", "Charmander"];
                // console.log(enemyArray);
                return character;
            case "Charmander":
                lvl = plevel;
                hp = 20;
                atk = 30;
                def = 20;
                sa = 30;
                sd = 20;
                s = 40;
                c = "darkred";
                t = "white";
                character = ([character, lvl, hp, atk, def, sa, sd, s, c, t]);
                // console.log(character);
                enemyArray = ["Squirtle", "Bulbasaur", "Pikachu"];
                // console.log(enemyArray);
                return character;
            
        }
    },
    setBattleMode: function(selectedCharacter,selectedEnemy){
        let schar = selectedCharacter[0].toLowerCase();
        let echar = selectedEnemy[0].toLowerCase();
        $(".mode-instruction").fadeOut(500)
        setTimeout(() => {
            $(".mode-instruction").text("Battle Mode").fadeIn(500);
        }, 500);
        $(".characters").fadeOut(500);
        $(".battleMode").fadeIn(1000);
        setTimeout(() => {
            $(".bmPlayer").fadeIn(3000);
            $(".bmCharacter").html("<div id = 'pimg'><img id = 'pcharacterPix' src = 'img/"+schar+".png'><img id = 'especial' src = 'img/"+echar+"-special.png'></div>");
            $("#pmon").text(selectedCharacter[0]);
            $("#lvl").text("Level: "+selectedCharacter[1]);
            $("#hp").text("HP: "+selectedCharacter[2]);
            $("#atk").text("Attack: "+selectedCharacter[3]);
            $("#def").text("Defense: "+selectedCharacter[4]);
            $("#sa").text("Special Attack: "+selectedCharacter[5]);
            $("#sd").text("Special Defense: "+selectedCharacter[6]);
            $("#s").text("Speed: "+selectedCharacter[7]);
            $(".bmPlayer").css('background-color', selectedCharacter[8]);
            $(".bmStats, #pmon").css('color', selectedCharacter[9]);
        }, 500);
        setTimeout(() => {
            $(".bmVs").fadeIn(500);
        }, 1000);
        setTimeout(() => {
            $(".bmEnemy").fadeIn(3000);
            $("#bmEnemyChar").html("<div id = 'eimg'><img id = 'echaracterPix' src = 'img/"+echar+".png'><img id = 'pspecial' src = 'img/"+schar+"-special.png'></div>");
            $("#epmon").text(selectedEnemy[0]);
            $("#elvl").text("Level: "+selectedEnemy[1]);
            $("#ehp").text("HP: "+selectedEnemy[2]);
            $("#eatk").text("Attack: "+selectedEnemy[3]);
            $("#edef").text("Defense: "+selectedEnemy[4]);
            $("#esa").text("Special Attack: "+selectedEnemy[5]);
            $("#esd").text("Special Defense: "+selectedEnemy[6]);
            $("#es").text("Speed: "+selectedEnemy[7]);
            $(".bmEnemy").css('background-color', selectedEnemy[8]);
            $(".bmeStats, #epmon").css('color', selectedEnemy[9]);
        }, 500);
        setTimeout(() => {
           $(".commentary").fadeIn(1500);
           $(".commentary").text(selectedCharacter[0] +" VERSUS " + selectedEnemy[0]);
        }, 1000);
    },
    firstHit: (player, cpu) =>{
        let z = speedLogic();
        game.critical(5, z, player, cpu);
        if(z === "player"){
            user.turn(player);
            console.log("player go");
        }
        else if(z === "enemy"){
            enemy.turn(cpu);
            console.log("enemy go");
        }
        else if(z === "miss"){
            let x = RNG(2);
            if(x === 0){
                enemy.miss(cpu);
                console.log("enemy Miss");
            }
            else{
                user.miss(player);
                console.log("player Miss");
            }
        }
        else{
            console.log("error");
        }
    },
    winChecker: (php, ehp) => {
        if(ehp[2] <= 0 && php[2] > 0){
            plevel++;
            setTimeout(() => {
            $(".wbox").css({"display": "block"});
            },1500);
            setTimeout(() => {
                $(".wbox").css({"pointer-events": "all"});
            }, 1800);
            $(".wbox").on("click", () => {
                game.reset();
            });
        }
    },
    lossChecker: (php, ehp) => {
        if(php[2] <= 0 && ehp[2] > 0){
            elevel++;
            setTimeout(() => {
                $(".lbox").css({"display": "block"});
                },1500);
                setTimeout(() => {
                    $(".lbox").css({"pointer-events": "all"});
                }, 1800);
                $(".lbox").on("click", () => {
                    game.reset();
                });
        }
    },
    reset: () => {
        console.log("reset Activated!");
        $(".battleMode").fadeOut(500);
        $(".commentary").fadeOut();
        $(".lbox").fadeOut(500);
        $(".wbox").fadeOut(500);
        $(".mode-instruction").fadeOut(500);
        setTimeout(() => {
            $(".mode-instruction").text("Choose Your Character").fadeIn(500);
        }, 500);
        $(".characters").fadeIn();
    },
    delay: (element, x) => {
        $(element).prop("disabled", true);
        setTimeout(() => {
            $(element).prop("disabled", false);
        }, x);
    },
    critical: (x, sl, p, e) => {
        let hit = RNG(x);
        let temp = Math.abs(Math.floor(x/2));
        if(hit === temp){
            let chitnum = Math.floor(Math.random()*Math.floor((selectedCharacter[5])/3)+1);
            console.log("this is the chitnum" + chitnum);
            console.log("this is the hit number" + hit);
            console.log("this is the temp number" + temp);
            if(sl === "player" && p !== "defend"){
                console.log("THIS IS THE SPEEDLOGIC RETURN: " + sl);
                pchit = chitnum;
                setTimeout(() => {
                    $(".echit").fadeIn(800);
                }, 800);
                setTimeout(() => {
                    $(".echit").fadeOut(800);
                }, 2000);
            }
            else if(sl === "enemy" && e !== "defend"){
                echit = chitnum;
                setTimeout(() => {
                    $(".pchit").fadeIn(800);
                }, 800);
                setTimeout(() => {
                    $(".pchit").fadeOut(800);
                }, 2000);
            }
            else{
                console.log("no Crit Hit");
            }
        }
        else{
            pchit = 0;
            echit = 0;
        }
    
    },

};

let animation = {
    pattack: () => {
        $("#pcharacterPix").animate({left: "-=50px"}, "slow");
        $("#pcharacterPix").animate({left: "+=600px"}, "fast");
        setTimeout(() => {
            $("#echaracterPix").animate({left: "+=20px"}, "fast");
            $("#echaracterPix").animate({left: "-=20px"}, "fast");
        }, 750);
        $("#pcharacterPix").animate({left: "-=550px"}, "fast");
    },
    pspecial: () => {
        $("#pspecial").animate({opacity: "1", width: "200px", height: "200px", left: "-=30px", top: "-=20px"}, "fast");
        $("#echaracterPix").animate({left: "+=20px"}, "fast");
        $("#pspecial").animate({opacity: ".5"}, "fast");
        $("#echaracterPix").animate({left: "-=20px"}, "fast");
        $("#pspecial").animate({opacity: "1"}, "fast");
        $("#echaracterPix").animate({left: "+=20px"}, "fast");
        $("#pspecial").animate({opacity: ".5"}, "fast");
        $("#echaracterPix").animate({left: "-=20px"}, "fast");
        $("#pspecial").animate({opacity: "1"}, "fast");
        $("#echaracterPix").animate({left: "+=20px"}, "fast");
        $("#pspecial").animate({opacity: ".5"}, "fast");
        $("#echaracterPix").animate({left: "-=20px"}, "fast");
        $("#pspecial").animate({opacity: "0", width: "200px", height: "200px", left: "+=30px", top: "+=20px"}, "fast");
    },
    pdefend: () => {
        for(i=0; i<2; i++){
            $("#pcharacterPix").animate({opacity: ".1"}, "fast");
            $("#pcharacterPix").animate({opacity: "1"}, "fast");
        }
    },
    pmiss: () => {
        $("#pcharacterPix").animate({left: "-=50px"}, "slow");
        $("#pcharacterPix").animate({left: "+=600px"}, "fast");
        setTimeout(() => {
            $("#echaracterPix").animate({top: "-=180px"}, "fast");
            $("#echaracterPix").animate({top: "+=180px"}, "fast");
        }, 700);
        $("#pcharacterPix").animate({left: "-=550px"}, "fast");
    },
    eattack: () => {
        $("#echaracterPix").animate({left: "+=50px"}, "slow");
        $("#echaracterPix").animate({left: "-=600px"}, "fast");
        setTimeout(() => {
            $("#pcharacterPix").animate({left: "-=20px"}, "fast");
            $("#pcharacterPix").animate({left: "+=20px"}, "fast");
        }, 750);
        $("#echaracterPix").animate({left: "+=550px"}, "fast");
    },
    especial: () => {
        $("#especial").animate({opacity: "1", width: "200px", height: "200px", left: "-=30px", top: "-=20px"}, "fast");
        $("#pcharacterPix").animate({left: "+=20px"}, "fast");
        $("#especial").animate({opacity: ".5"}, "fast");
        $("#pcharacterPix").animate({left: "-=20px"}, "fast");
        $("#especial").animate({opacity: "1"}, "fast");
        $("#pcharacterPix").animate({left: "+=20px"}, "fast");
        $("#especial").animate({opacity: ".5"}, "fast");
        $("#pcharacterPix").animate({left: "-=20px"}, "fast");
        $("#especial").animate({opacity: "1"}, "fast");
        $("#pcharacterPix").animate({left: "+=20px"}, "fast");
        $("#especial").animate({opacity: ".5"}, "fast");
        $("#pcharacterPix").animate({left: "-=20px"}, "fast");
        $("#especial").animate({opacity: "0", width: "200px", height: "200px", left: "+=30px", top: "+=20px"}, "fast");
    },
    edefend: () => {
        for(i=0; i<2; i++){
            $("#echaracterPix").animate({opacity: ".1"}, "fast");
            $("#echaracterPix").animate({opacity: "1"}, "fast");
        }
    },
    emiss: () => {
        $("#echaracterPix").animate({left: "+=50px"}, "slow");
        $("#echaracterPix").animate({left: "-=600px"}, "fast");
        setTimeout(() => {
            $("#pcharacterPix").animate({top: "-=180px"}, "fast");
            $("#pcharacterPix").animate({top: "+=180px"}, "fast");
        }, 700);
        $("#echaracterPix").animate({left: "+=550px"}, "fast");
    },
};
});