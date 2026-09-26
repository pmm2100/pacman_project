function login_zoom_out(){
    const login_menu = document.getElementById("login_menu");

    let scale = 2;
    const interval = setInterval(() => {
        scale -= 0.05;
        login_menu.style.transform = `scale(${scale})`;

        if (scale <= 1) {
            clearInterval(interval);
            login_menu.style.transform = "scale(1)";
        }
    }, 16);
    setTimeout(() => {
        const login_box = document.getElementById("login_box");
        login_box.style.display = "flex";
    },320)
}

login_zoom_out();