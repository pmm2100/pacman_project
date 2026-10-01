fetch("./db_funcs/highscore.php")
    .then(response=>response.json())
    .then(data=>{
        highscore = data.highscore ?? 0;
        document.getElementById("highscore").innerHTML="Highscore: "+highscore;
    })
    .catch(error=>{
        console.log("Error fetching highscore: \n", error);
    })


function start_game() {




    function reset() {
        moving = [false, false, false, false];

        balls = 244;
        scatter = false;
        time = 0;
        begin = true;
        eatenBonus=200;
        loss = false;
        const score_board = document.getElementById("score")
        score = 0;
        score_board.innerHTML = "Score: " + score;


        const cssW = 0.38 * window.innerWidth; //canvas.clientWidth
        const cssH = 0.42 * window.innerWidth;// canvas.clientHeight;
        const tile = Math.min(Math.floor(cssW / 28), Math.floor(cssH / 31));
        const dpr = window.devicePixelRatio || 1;

        canvas.width = tile * 28 * dpr;
        canvas.height = tile * 31 * dpr;
        canvas.style.width = (tile * 28 / window.innerWidth * 100) + "vw";
        canvas.style.height = (tile * 31 / window.innerHeight * 100) + "vh";

        ctx.scale(dpr, dpr);
    }

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d")
    //28x28 mapa
    const map = [ // 0 - normalne pole, 1 - ściana, 2 - spawn duchów , 3 - puste pole
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 3, 1, 1, 3, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 3, 1, 1, 1, 2, 2, 1, 1, 1, 3, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 3, 1, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [5, 5, 5, 5, 5, 5, 0, 3, 3, 3, 1, 2, 2, 2, 2, 2, 2, 1, 3, 3, 3, 0, 5, 5, 5, 5, 5, 5],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 3, 1, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 0, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
        [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
        [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],

    ];

    function BigBalls() {
        let amount = 4;
        let rand1 = Math.floor(Math.random() * 31);
        let rand2 = Math.floor(Math.random() * 28);
        while (amount > 0) {
            if (map[rand1][rand2] == 0) {
                map[rand1][rand2] = 4;
                amount -= 1;
            }
            rand1 = Math.floor(Math.random() * 31);
            rand2 = Math.floor(Math.random() * 28);
        }
    }

    BigBalls();

    let moving = [false, false, false, false];

    let balls = 244;
    let scatter = false;
    let time = 0;
    let begin = true;
    let loss = false;
    let eatenBonus=200;
    const score_board = document.getElementById("score")
    const highscore_board = document.getElementById("highscore")
    highscore_board.innerHTML = "Highscore: " + highscore;
    let score = 0;
    score_board.innerHTML = "Score: " + score;


    const cssW = 0.38 * window.innerWidth; //canvas.clientWidth
    const cssH = 0.42 * window.innerWidth;// canvas.clientHeight;
    const tile = Math.min(Math.floor(cssW / 28), Math.floor(cssH / 31));
    const dpr = window.devicePixelRatio || 1;

    canvas.width = tile * 28 * dpr;
    canvas.height = tile * 31 * dpr;
    canvas.style.width = tile * 28 + "px";
    canvas.style.height = tile * 31 + "px";

    ctx.scale(dpr, dpr);

    function draw_map() {

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "rgb(33,33,255)";
        ctx.lineWidth = Math.round(tile / 6);
        lw = ctx.lineWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let d = 0; d < 31; d++) {
            for (let s = 0; s < 28; s++) {

                if (map[d][s] == 0) {
                    ctx.beginPath();
                    ctx.fillStyle = "orange";
                    ctx.arc(s * tile + tile / 2, d * tile + tile / 2, tile / 5, 0, Math.PI * 2);
                    ctx.fill();
                }

                if (map[d][s] == 4) {
                    ctx.beginPath();
                    ctx.fillStyle = "orange";
                    ctx.arc(s * tile + tile / 2, d * tile + tile / 2, tile / 3, 0, Math.PI * 2);
                    ctx.fill();
                }

                if (map[d][s] !== 1) continue;

                const ss = s * tile;
                const dd = d * tile;

                ctx.beginPath();

                if (d - 1 >= 0 && (map[d - 1][s] == 0 || map[d - 1][s] == 3 || map[d - 1][s] == 4 || map[d - 1][s] == 5)) {
                    if (map[d][s - 1] == 0 || map[d][s - 1] == 3 || map[d][s - 1] == 4) {
                        ctx.moveTo(ss + lw, dd + lw);
                        ctx.lineTo(ss + tile, dd + lw);
                    } else if ((map[d][s + 1] == 0 || map[d][s + 1] == 3 || map[d][s + 1] == 4 || map[d][s + 1] == 5)) {
                        ctx.moveTo(ss, dd + lw);
                        ctx.lineTo(ss + tile - lw, dd + lw);
                    } else {
                        ctx.moveTo(ss, dd + lw);
                        ctx.lineTo(ss + tile, dd + lw);
                    }
                }

                if (d + 1 <= 30 && (map[d + 1][s] == 0 || map[d + 1][s] == 3 || map[d + 1][s] == 4 || map[d + 1][s] == 5)) {
                    if (map[d][s - 1] == 0 || map[d][s - 1] == 3 || map[d][s - 1] == 4 || map[d][s - 1] == 5) {
                        ctx.moveTo(ss + lw, dd + tile - lw);
                        ctx.lineTo(ss + tile, dd + tile - lw);
                    } else if (map[d][s + 1] == 0 || map[d][s + 1] == 3 || map[d][s + 1] == 4 || map[d][s + 1] == 5) {
                        ctx.moveTo(ss, dd + tile - lw);
                        ctx.lineTo(ss + tile - lw, dd + tile - lw);
                    } else {
                        ctx.moveTo(ss, dd + tile - lw);
                        ctx.lineTo(ss + tile, dd + tile - lw);
                    }
                }

                if (s - 1 >= 0 && (map[d][s - 1] == 0 || map[d][s - 1] == 3 || map[d][s - 1] == 4 || map[d][s - 1] == 5)) {
                    if (map[d - 1][s] == 0 || map[d - 1][s] == 3 || map[d - 1][s] == 4 || map[d - 1][s] == 5) {
                        ctx.moveTo(ss + lw, dd + lw);
                        ctx.lineTo(ss + lw, dd + tile);
                    } else if (map[d + 1][s] == 0 || map[d + 1][s] == 3 || map[d + 1][s] == 4 || map[d + 1][s] == 5) {
                        ctx.moveTo(ss + lw, dd);
                        ctx.lineTo(ss + lw, dd + tile - lw);
                    } else {
                        ctx.moveTo(ss + lw, dd);
                        ctx.lineTo(ss + lw, dd + tile);
                    }
                }

                if (s + 1 <= 27 && (map[d][s + 1] == 0 || map[d][s + 1] == 3 || map[d][s + 1] == 4 || map[d][s + 1] == 5)) {

                    if (map[d - 1][s] == 0 || map[d - 1][s] == 3 || map[d - 1][s] == 4 || map[d - 1][s] == 5) {
                        ctx.moveTo(ss + tile - lw, dd + lw);
                        ctx.lineTo(ss + tile - lw, dd + tile);
                    } else if (map[d + 1][s] == 0 || map[d + 1][s] == 3 || map[d + 1][s] == 4 || map[d + 1][s] == 5) {
                        ctx.moveTo(ss + tile - lw, dd);
                        ctx.lineTo(ss + tile - lw, dd + tile - lw);
                    } else {
                        ctx.moveTo(ss + tile - lw, dd);
                        ctx.lineTo(ss + tile - lw, dd + tile);
                    }
                }

                ctx.stroke();
            }
        }
    }

    function loadImage(src) {
        const img = new Image();
        img.src = src;
        return img;
    }

    const scaredImg = loadImage("./assets/images/scared.png");

    const redImages = {
        up: loadImage("./assets/images/red_up.png"),
        down: loadImage("./assets/images/red_down.png"),
        left: loadImage("./assets/images/red_left.png"),
        right: loadImage("./assets/images/red_right.png")
    };

    const pinkImages = {
        up: loadImage("./assets/images/pink_up.png"),
        down: loadImage("./assets/images/pink_down.png"),
        left: loadImage("./assets/images/pink_left.png"),
        right: loadImage("./assets/images/pink_right.png")
    };

    const blueImages = {
        up: loadImage("./assets/images/blue_up.png"),
        down: loadImage("./assets/images/blue_down.png"),
        left: loadImage("./assets/images/blue_left.png"),
        right: loadImage("./assets/images/blue_right.png")
    };

    const orangeImages = {
        up: loadImage("./assets/images/orange_up.png"),
        down: loadImage("./assets/images/orange_down.png"),
        left: loadImage("./assets/images/orange_left.png"),
        right: loadImage("./assets/images/orange_right.png")
    };


    const pacmanImages = {
        up_closed: loadImage("./assets/images/pacman-up-closed.png"),
        down_closed: loadImage("./assets/images/pacman-down-closed.png"),
        left_closed: loadImage("./assets/images/pacman-left-closed.png"),
        right_closed: loadImage("./assets/images/pacman-right-closed.png"),
        up_open: loadImage("./assets/images/pacman-up-open.png"),
        down_open: loadImage("./assets/images/pacman-down-open.png"),
        left_open: loadImage("./assets/images/pacman-left_open.png"),
        right_open: loadImage("./assets/images/pacman-right-open.png")
    };

    const eatenImages = {
        up_eaten: loadImage("./assets/images/eyes_up.png"),
        left_eaten: loadImage("./assets/images/eyes_left.png"),
        down_eaten: loadImage("./assets/images/eyes_down.png"),
        right_eaten: loadImage("./assets/images/eyes_right.png")
    }


    let pacman = {
        images: pacmanImages,
        pacX: 13.5*tile,
        pacY: 23.5*tile,
        speed: (tile),
        mouth_open: false,
        lastDir:1
    }
    let red_ghost = {
        name: "red",
        images: redImages,
        eatenImages: eatenImages,
        spawnOX: 13.5 * tile,
        spawnOY: 14.5 * tile,
        eatenSpawnOX: 12.5 * tile,
        eatenSpawnOY: 14.5 * tile,
        OX: 13.5 * tile,
        OY: 14.5 * tile,
        speed: tile,
        eaten: false,
        begin: true,
        lastDir: 1
    };

    let pink_ghost = {
        name: "pink",
        images: pinkImages,
        eatenImages: eatenImages,
        spawnOX: 14.5 * tile,
        spawnOY: 14.5 * tile,
        eatenSpawnOX: 13.5 * tile,
        eatenSpawnOY: 14.5 * tile,
        OX: 14.5 * tile,
        OY: 14.5 * tile,
        speed: tile,
        eaten: false,
        begin: true,
        lastDir: 1
    };

    let blue_ghost = {
        name: "blue",
        images: blueImages,
        eatenImages: eatenImages,
        spawnOX: 15.5 * tile,
        spawnOY: 14.5 * tile,
        eatenSpawnOX: 13.5 * tile,
        eatenSpawnOY: 14.5 * tile,
        OX: 15.5 * tile,
        OY: 14.5 * tile,
        speed: tile,
        eaten: false,
        begin: true,
        lastDir: 1
    };

    let orange_ghost = {
        name: "orange",
        images: orangeImages,
        eatenImages: eatenImages,
        eatenSpawnOX: 13.5 * tile,
        eatenSpawnOY: 14.5 * tile,
        spawnOX: 12.5 * tile,
        spawnOY: 14.5 * tile,
        OX: 12.5 * tile,
        OY: 14.5 * tile,
        speed: tile,
        eaten: false,
        begin: true,
        lastDir: 1
    };
    function draw_player(){


        if (pacman.mouth_open){
            if (pacman.lastDir==1){
                ctx.drawImage(pacman.images.up_open,pacman.pacX - tile / 2,pacman.pacY - tile / 2,tile,tile);
            }else if (pacman.lastDir==2){
                ctx.drawImage(pacman.images.left_open,pacman.pacX - tile / 2,pacman.pacY - tile / 2,tile,tile);
            }else if (pacman.lastDir==3){
                ctx.drawImage(pacman.images.down_open,pacman.pacX - tile / 2,pacman.pacY - tile / 2,tile,tile);
            }else if (pacman.lastDir==4){
                ctx.drawImage(pacman.images.right_open,pacman.pacX - tile / 2,pacman.pacY - tile / 2,tile,tile);
            }
            pacman.mouth_open=false;

        } else {
            if (pacman.lastDir==1){
                ctx.drawImage(pacman.images.up_closed,pacman.pacX - tile / 2,pacman.pacY - tile / 2,tile,tile);
            }else if (pacman.lastDir==2){
                ctx.drawImage(pacman.images.left_closed,pacman.pacX - tile / 2,pacman.pacY - tile / 2,tile,tile);
            }else if (pacman.lastDir==3){
                ctx.drawImage(pacman.images.down_closed,pacman.pacX - tile / 2,pacman.pacY - tile / 2,tile,tile);
            }else if (pacman.lastDir==4){
                ctx.drawImage(pacman.images.right_closed,pacman.pacX - tile / 2,pacman.pacY - tile / 2,tile,tile);
            }
            pacman.mouth_open=true;
        }

    }
    function draw_ghosts(){
        const ghosts = [
            red_ghost,
            pink_ghost,
            blue_ghost,
            orange_ghost
        ];

        for (const ghost of ghosts){
            if (ghost.eaten){
                direction_eaten(ghost);
            }
            else if (scatter){
                ctx.drawImage(
                    scaredImg,
                    ghost.OX - tile / 2,
                    ghost.OY - tile / 2,
                    tile,
                    tile
                );
            } else {
                direction(ghost);
            }
        }
    }
    function direction(object){

        let img;


        switch (object.lastDir){
            case 1:
                img = object.images.up;
                break;

            case 2:
                img = object.images.left;
                break;

            case 3:
                img = object.images.down;
                break;

            case 4:
                img = object.images.right;
                break;

            default:
                img = object.images.right;
        }

        ctx.drawImage(
            img,
            object.OX - tile / 2,
            object.OY - tile / 2,
            tile,
            tile
        );
    }

    function direction_eaten(object){

        let img;


        switch (object.lastDir){
            case 1:
                img = object.eatenImages.up_eaten;
                break;

            case 2:
                img = object.eatenImages.left_eaten;
                break;

            case 3:
                img = object.eatenImages.down_eaten;
                break;

            case 4:
                img = object.eatenImages.right_eaten;
                break;

            default:
                img = object.eatenImages.right_eaten;
        }

        ctx.drawImage(
            img,
            object.OX - tile / 2,
            object.OY - tile / 2,
            tile,
            tile
        );
    }
    function check_corners(object , home){
        let corners=[false, false, false, false];
        let temporary=0;

        const row = Math.floor(object.OY / tile);
        const col = Math.floor(object.OX / tile);
        if (home && map[row+1][col]==2){
            corners[0]=true;
        }
        if (home && map[row-1][col]==2){
            corners[1]=true;
        }
        if (home && map[row][col-1]==2){
            corners[2]=true;
        }
        if (home && map[row][col+1]==2){
            corners[3]=true;
        }
        if(map[row+1][col]==0 || map[row+1][col]==3 || map[row+1][col]==4){
            corners[0]=true;
        }
        if (map[row-1][col]==0 || map[row-1][col]==3 || map[row-1][col]==4){
            corners[1]=true;
        }
        if (map[row][col-1]==0 || map[row][col-1]==3 || map[row][col-1]==4){
            corners[2]=true;
        }
        if (map[row][col+1]==0 || map[row][col+1]==3 || map[row][col+1]==4){
            corners[3]=true;
        }
        for (let i = 0; i < 4; i++){
            if (corners[i]) temporary+=1;
        }
        return temporary;
    }
    function follow_player(X, Y, object, OX, OY, speed, home){

        X = X / tile;
        Y = Y / tile;

        let checkX = Math.abs(X - OX);
        let checkY = Math.abs(Y - OY);
        let corners_num = check_corners(object, home);

        let upper = map[Math.floor(OY-1)][Math.floor(OX)];
        let right = map[Math.floor(OY)][Math.floor(OX+1)];
        let down = map[Math.floor(OY+1)][Math.floor(OX)];
        let left = map[Math.floor(OY)][Math.floor(OX-1)];

        // if (object.name=="red"){
        //     console.log("checkX: "+checkX+" checkY: "+checkY)
        //     console.log("OX: "+object.OX/tile+" OY: "+object.OY/tile)
        //     console.log("X: "+X+" Y: "+Y)
        //     console.log("corners: "+corners_num)
        //     console.log("lastDir: "+object.lastDir)
        //     console.log("upper: "+upper+" left: "+left+" down: "+down+" right: "+right)
        // }

        if (checkX>checkY){
            if (check_availability(left, home) && object.lastDir!=4){
                if (check_availability(right, home) && object.lastDir!=2){
                    if (X>OX){
                        object.OX+=speed;
                        object.lastDir=4;
                        return;
                    }else if (X<=OX){
                        object.OX-=speed;
                        object.lastDir=2;
                        return;
                    }
                }
                else{
                    decide(upper, down, left, right, home, object, X, Y, OX, OY, speed);
                }
            }else{
                if(check_availability(right, home) && object.lastDir!=2){
                    object.OX+=speed;
                    object.lastDir=4;
                    return;
                }
                else{
                    check_up_down(upper, down, home, object, Y, OY, speed);

                }
            }
        }else if (checkY>checkX){
            if (check_availability(upper, home) && object.lastDir!=3){
                if (check_availability(down, home) && object.lastDir!=1){
                    if (Y>OY){
                        object.OY+=speed;
                        object.lastDir=3;
                        return;
                    }else if (Y<=OY){
                        object.OY-=speed;
                        object.lastDir=1;
                        return;
                    }
                }
                else{
                    decide(upper, down, left, right, home, object, X, Y, OX, OY, speed);
                }
            }else{
                if(check_availability(down, home) && object.lastDir!=1){
                    object.OY+=speed;
                    object.lastDir=3;
                    return;
                }else{
                    check_left_right(left, right, home, object, X, OX, speed);
                }
            }
        }else if (checkX==checkY){
            decide(upper, down, left, right, home, object, X, Y, OX, OY, speed);
        }


        function decide(upper, down, left, right, home, object, X, Y, OX, OY, speed){
            const options = [];

            if (check_availability(upper, home) && object.lastDir != 3)
                options.push({ dist: Math.abs(X - OX) + Math.abs(Y - (OY - speed)), move: () => { object.OY -= speed; object.lastDir = 1; }});

            if (check_availability(down, home) && object.lastDir != 1)
                options.push({ dist: Math.abs(X - OX) + Math.abs(Y - (OY + speed)), move: () => { object.OY += speed; object.lastDir = 3; }});

            if (check_availability(left, home) && object.lastDir != 4)
                options.push({ dist: Math.abs(X - (OX - speed)) + Math.abs(Y - OY), move: () => { object.OX -= speed; object.lastDir = 2; }});

            if (check_availability(right, home) && object.lastDir != 2)
                options.push({ dist: Math.abs(X - (OX + speed)) + Math.abs(Y - OY), move: () => { object.OX += speed; object.lastDir = 4; }});

            if (options.length === 0) return false;

            options.sort((a, b) => a.dist - b.dist);
            options[0].move();
            return true;
        }
        function check_left_right(left, right, home, object, X, OX, speed){

            if (check_availability(left, home) && object.lastDir!=4){
                if (check_availability(right, home) && object.lastDir!=2){
                    if (X>OX){
                        object.OX+=speed;
                        object.lastDir=4;
                        return true;
                    }else if (X<=OX){
                        object.OX-=speed;
                        object.lastDir=2;
                        return true;
                    }
                }else if (check_availability(left, home) && object.lastDir!=4){
                    object.OX-=speed;
                    object.lastDir=2;
                    return true;
                }
            }else {
                if (check_availability(right, home) && object.lastDir!=2) {
                    object.OX += speed;
                    object.lastDir = 4;
                    return true;
                }
            }
            return false;
        }

        function check_up_down(upper, down, home, object, Y, OY, speed){

            if (check_availability(upper, home) && object.lastDir!=3){
                if (check_availability(down, home) && object.lastDir!=1){
                    if (Y>OY){
                        object.OY+=speed;
                        object.lastDir=3;
                        return true;
                    }else if (Y<=OY){
                        object.OY-=speed;
                        object.lastDir=1;
                        return true;
                    }
                }else if (check_availability(upper, home) && object.lastDir!=3){
                    object.OY-=speed;
                    object.lastDir=1;
                    return true;
                }
            }else{
                if(check_availability(down, home) && object.lastDir!=1){
                    object.OY+=speed;
                    object.lastDir=3;
                    return true;
                }
            }
            return  false;
        }



        function check_availability(dir, home){

            if ((dir==0 || dir==3 || dir==4) || (home && dir==2)){
                return true;
            }else{
                return false;
            }

        }


    }
    function game(){

        if (checkloss() && !scatter){

            loss=true;
            document.getElementById("info").innerHTML="Przegrałes"
            reset()
            document.getElementById("infobox").style.display="flex"
            return

        }
        if (moving[0] && (
            map[Math.floor(((pacman.pacY-pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 0 ||
            map[Math.floor(((pacman.pacY-pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 3 ||
            map[Math.floor(((pacman.pacY-pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 4 ||
            map[Math.floor(((pacman.pacY-pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 5
        )){
            pacman.pacY -= pacman.speed
        }

        else if (moving[1] && (
            map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX-pacman.speed) / tile)] == 0 ||
            map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX-pacman.speed) / tile)] == 3 ||
            map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX-pacman.speed) / tile)] == 4 ||
            map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX-pacman.speed) / tile)] == 5
        )){
            pacman.pacX -= pacman.speed
        }

        else if (moving[2] && (
            map[Math.floor(((pacman.pacY+pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 0 ||
            map[Math.floor(((pacman.pacY+pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 3 ||
            map[Math.floor(((pacman.pacY+pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 4 ||
            map[Math.floor(((pacman.pacY+pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 5
        )){
            pacman.pacY += pacman.speed
        }

        else if (moving[3] && (
            map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX+pacman.speed) / tile)] == 0 ||
            map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX+pacman.speed) / tile)] == 3 ||
            map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX+pacman.speed) / tile)] == 4 ||
            map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX+pacman.speed) / tile)] == 5
        )){
            pacman.pacX += pacman.speed
        }
        check_eaten(pacman.pacX, pacman.pacY, red_ghost);
        check_eaten(pacman.pacX, pacman.pacY, pink_ghost);
        check_eaten(pacman.pacX, pacman.pacY, blue_ghost);
        check_eaten(pacman.pacX, pacman.pacY, orange_ghost);
        if (!loss && checkloss() && !scatter){

            loss=true;
            document.getElementById("info").innerHTML="Przegrałes"
            document.getElementById("infobox").style.display="flex"

        }


        draw_map();
        draw_player();
        checkbigball();
        draw_ghosts();

        check_eaten(pacman.pacX, pacman.pacY, red_ghost);
        check_eaten(pacman.pacX, pacman.pacY, pink_ghost);
        check_eaten(pacman.pacX, pacman.pacY, blue_ghost);
        check_eaten(pacman.pacX, pacman.pacY, orange_ghost);

        // czerwony
        move_ghost(red_ghost, pacman.pacX, pacman.pacY, 27*tile, tile);

        // różowy
        let pinkX = pacman.pacX, pinkY = pacman.pacY;
        switch (pacman.lastDir) {
            case 1: pinkY -= 4*tile; break;
            case 2: pinkX -= 4*tile; break;
            case 3: pinkY += 4*tile; break;
            case 4: pinkX += 4*tile; break;
        }
        move_ghost(pink_ghost, pinkX, pinkY, tile, tile);

        // niebieski
        let iinx, iiny;
        switch (pacman.lastDir) {
            case 1: iinx = pacman.pacX + pacman.pacX + 2*tile - red_ghost.OX; iiny = (pacman.pacY+2*tile)+(pacman.pacY+2*tile-red_ghost.OY); break;
            case 2: iinx = (pacman.pacX+2*tile)+(pacman.pacX+2*tile-red_ghost.OX); iiny = pacman.pacY+pacman.pacY+2*tile-red_ghost.OY; break;
            case 3: iinx = pacman.pacX+(pacman.pacX-2*tile-red_ghost.OX); iiny = (pacman.pacY-2*tile)+(pacman.pacY-2*tile-red_ghost.OY); break;
            case 4: iinx = (pacman.pacX-2*tile)+(pacman.pacX-2*tile-red_ghost.OX); iiny = pacman.pacY+(pacman.pacY-2*tile-red_ghost.OY); break;
        }
        iinx = Math.max(0, Math.min(27*tile, iinx));
        iiny = Math.max(0, Math.min(30*tile, iiny));
        move_ghost(blue_ghost, iinx, iiny, 27*tile, 29*tile);

        // pomarańczowy
        const odx = Math.abs(pacman.pacX - orange_ghost.OX);
        const ody = Math.abs(pacman.pacY - orange_ghost.OY);
        const orangeTargetX = (odx > 8 && ody > 8) ? pacman.pacX : tile;
        const orangeTargetY = (odx > 8 && ody > 8) ? pacman.pacY : 29*tile;
        move_ghost(orange_ghost, orangeTargetX, orangeTargetY, tile, 29*tile);

        check_eaten(pacman.pacX, pacman.pacY, red_ghost);
        check_eaten(pacman.pacX, pacman.pacY, pink_ghost);
        check_eaten(pacman.pacX, pacman.pacY, blue_ghost);
        check_eaten(pacman.pacX, pacman.pacY, orange_ghost);

        teleport();


        if (!loss && checkloss() && !scatter){

            loss=true;
            document.getElementById("info").innerHTML="Przegrałes"
            update_highscore()
            document.getElementById("infobox").style.display="flex"


        }
        if (checkvictory()){

            loss = true;
            document.getElementById("info").innerHTML="Wygrales"
            update_highscore()
            document.getElementById("infobox").style.display="flex"



        }
        if (!loss){
            setTimeout(()=>{
                window.requestAnimationFrame(game)
            },200)


        }




    }
    game()
    document.getElementById("start_but").addEventListener("click", ()=>{
        document.getElementById("infobox").style.display="none";
        reset();

    })
    function update_highscore(){
        fetch("./db_funcs/update_highscore.php",{method:"POST", headers:{"Content-type":"application/json"}, body:JSON.stringify({highscore:highscore})})
            .then(response=>response.json())
            .catch(error=>{
                console.log("Error updating highscore: \n"+error)
            })
    }
    function move_ghost(ghost, targetX, targetY, scatterX, scatterY) {
        const gx = Math.floor(ghost.OX / tile);
        const gy = Math.floor(ghost.OY / tile);

        if (ghost.eaten) {
            follow_player(ghost.eatenSpawnOX, ghost.eatenSpawnOY, ghost, gx, gy, ghost.speed, true);
            if (Math.floor(ghost.OX) === Math.floor(ghost.eatenSpawnOX) && Math.floor(ghost.OY) === Math.floor(ghost.eatenSpawnOY)) {
                setTimeout(()=>{
                    ghost.eaten = false;
                    ghost.begin = true;
                    score+=200
                    if (score>highscore){
                        highscore=score
                        highscore_board.innerHTML="Highscore: "+highscore;
                    }
                    score_board.innerHTML="Score: "+score;
                },1000)
            }
            return;
        }

        if (ghost.begin) {
            follow_player(13.5 * tile, 11.5 * tile, ghost, gx, gy, ghost.speed, true);
            if (ghost.OY <= 11.5 * tile) {
                ghost.begin = false;
            }
            return;
        }

        if (scatter) {
            follow_player(scatterX, scatterY, ghost, gx, gy, ghost.speed, false);
        } else {
            follow_player(targetX, targetY, ghost, gx, gy, ghost.speed, false);
        }
    }
    function check_eaten(X, Y, object) {
        if (scatter && Math.floor(X) == Math.floor(object.OX) && Math.floor(Y) == Math.floor(object.OY)) {
            if (object.eaten==false){
                if (eatenBonus>1600){
                    eatenBonus=200;
                }
                score+=eatenBonus;
                score_board.innerHTML="Score: "+score;
                eatenBonus*=2;
                if (score>highscore){
                    highscore=score
                    highscore_board.innerHTML="Highscore: "+highscore;
                }
            }
            object.eaten = true;


            }
        }
    function checkloss(){
        if (!red_ghost.eaten && Math.floor(pacman.pacX)==Math.floor(red_ghost.OX) && Math.floor(pacman.pacY)==Math.floor(red_ghost.OY)){
            return true;
        }else if (!pink_ghost.eaten && Math.floor(pacman.pacX)==Math.floor(pink_ghost.OX) && Math.floor(pacman.pacY)==Math.floor(pink_ghost.OY)){
            return true;
        }else if (!blue_ghost.eaten && Math.floor(pacman.pacX)==Math.floor(blue_ghost.OX) && Math.floor(pacman.pacY)==Math.floor(blue_ghost.OY)){
            return true;
        }else if (!orange_ghost.eaten && Math.floor(pacman.pacX)==Math.floor(orange_ghost.OX) && Math.floor(pacman.pacY)==Math.floor(orange_ghost.OY)){
            return true;
        }
        return false;
    }
    function checkvictory(){
        if (map[Math.floor(pacman.pacY / tile)][Math.floor(pacman.pacX / tile)] == 0 || map[Math.floor(pacman.pacY / tile)][Math.floor(pacman.pacX / tile)] == 4){
            score+=10
            if (score>highscore){
                highscore=score
                highscore_board.innerHTML="Highscore: "+highscore;
            }

            score_board.innerHTML="Score: "+score;
            balls-=1
            map[Math.floor(pacman.pacY / tile)][Math.floor(pacman.pacX / tile)]=3
        }
        if(balls === 0){
            return true;
        }
        else{
            return false;
        }
    }


    function checkbigball(){
        if (map[Math.floor(pacman.pacY / tile)][Math.floor(pacman.pacX / tile)] == 4){
            score+=50
            if (score>highscore){
                highscore=score
                highscore_board.innerHTML="Highscore: "+highscore;
            }
            score_board.innerHTML="Score: "+score;
            time += 40
            scatter=true;
        }
        if (time > 0){
            time-=1
        }else{
            scatter=false;
            eatenBonus=200

            return;
        }

        if (time === 0){
            if (begin){
                begin=false;
                return;
            }

            scatter=false;
            eatenBonus=200
        }
    }

    function move(num){
        for (let i = 0; i < 4; i++){
            if (i === num) moving[i] = true;
            else moving[i] = false;
        }
    }
    function teleport(){
        if (Math.floor(pacman.pacY / tile) === 14 &&  Math.floor(pacman.pacX / tile) === 0){
            pacman.pacX = 27*tile -tile/2;
        }
        if (Math.floor(pacman.pacY / tile) === 14 &&  Math.floor((pacman.pacX+pacman.speed) / tile) === 28){
            pacman.pacX = 1*tile -tile/2;}
    }
    addEventListener("keydown", e=>{
        if (e.key==="w"){
            if (
                map[Math.floor(((pacman.pacY-pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 0 ||
                map[Math.floor(((pacman.pacY-pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 3 ||
                map[Math.floor(((pacman.pacY-pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 4 ||
                map[Math.floor(((pacman.pacY-pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 5
            ){
                move(0);
                pacman.lastDir=1;
            }
        } else if(e.key==="a"){
            if (
                map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX-pacman.speed) / tile)] == 0 ||
                map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX-pacman.speed) / tile)] == 3 ||
                map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX-pacman.speed) / tile)] == 4 ||
                map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX-pacman.speed) / tile)] == 5
            ){
                move(1);
                pacman.lastDir=2;
            }
        } else if(e.key==="s"){
            if (
                map[Math.floor(((pacman.pacY+pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 0 ||
                map[Math.floor(((pacman.pacY+pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 3 ||
                map[Math.floor(((pacman.pacY+pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 4 ||
                map[Math.floor(((pacman.pacY+pacman.speed) - tile / 2) / tile)][Math.floor(pacman.pacX / tile)] == 5
            ){
                move(2);
                pacman.lastDir=3;
            }
        } else if(e.key==="d"){
            if (
                map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX+pacman.speed) / tile)] == 0 ||
                map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX+pacman.speed) / tile)] == 3 ||
                map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX+pacman.speed) / tile)] == 4 ||
                map[Math.floor((pacman.pacY - tile / 2) / tile)][Math.floor((pacman.pacX+pacman.speed) / tile)] == 5
            ){
                move(3);
                pacman.lastDir=4;
            }
        }
    })
}
let first = true
if (first){
    document.getElementById("start_but").addEventListener("click", ()=>{
        document.getElementById("infobox").style.display="none";
        start_game();

    })
    first=false}
