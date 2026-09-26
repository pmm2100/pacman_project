function register_zoom_out(){

    const register_menu = document.getElementById("register_menu");

    let scale = 2;
    const interval = setInterval(() => {
        scale -= 0.05;
        register_menu.style.transform = `scale(${scale})`;

        if (scale <= 1) {
            clearInterval(interval);
            register_menu.style.transform = "scale(1)";
        }
    }, 16);
    setTimeout(() => {
        const register_box = document.getElementById("register_box");
        register_box.style.display = "flex";
    },320)


}

register_zoom_out()