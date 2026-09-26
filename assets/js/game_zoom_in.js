function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

const images = [
    "./assets/images/pacman_anim/pacmananim2.png",
    "./assets/images/pacman_anim/pacmananim3.png",
    "./assets/images/pacman_anim/pacmananim4.png",
    "./assets/images/pacman_anim/pacmananim5.png",
    "./assets/images/pacman_anim/pacmananim6.png",
    "./assets/images/pacman_anim/pacmananim7.png"
];
function game_zoom_in(images){
    const start_butt = document.getElementById("start");
    const game_menu = document.getElementById("game_menu");

    start_butt.addEventListener("click", () => {
        pacman_animation(images)
            let scale = 1;
            game_menu.style.transform = "scale(1)";
            const interval = setInterval(() => {
                scale += 0.05;
                game_menu.style.transform = `scale(${scale})`;

                if (scale >= 2) {
                    clearInterval(interval)
                }
            }, 45);
            setTimeout(() => {
                window.location.href="./register/login.php";

            },900)





    });
}
function pacman_animation(images){
    const start_butt = document.getElementById("start")



        images.forEach((image, index) => {
            setTimeout(() => {
                start_butt.style.backgroundImage = `url(${image})`;
            }, 150 * (index + 1));
        });


}

game_zoom_in(images);

window.addEventListener('pageshow', () => {


    images.forEach(image=>{
        loadImage(image)
    })

    const start_butt = document.getElementById("start");
    const game_name = document.getElementById("game-name");
    const game_menu = document.getElementById("game_menu");
    game_menu.style.display="flex";
    game_menu.style.transform = "scale(1)";
    start_butt.style.backgroundImage = "url(./assets/images/pacman_anim/pacmananim1.png)";
    start_butt.style.display = "flex";
    game_name.style.display = "block";
});