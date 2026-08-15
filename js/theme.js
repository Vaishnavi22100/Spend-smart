document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("themeToggle");

    if(localStorage.getItem("theme")==="dark"){
        document.body.classList.add("dark");
        if(btn) btn.textContent="☀️";
    }

    if(btn){

        btn.addEventListener("click",()=>{

            document.body.classList.toggle("dark");

            if(document.body.classList.contains("dark")){
                localStorage.setItem("theme","dark");
                btn.textContent="☀️";
            }else{
                localStorage.setItem("theme","light");
                btn.textContent="🌙";
            }

        });

    }

});