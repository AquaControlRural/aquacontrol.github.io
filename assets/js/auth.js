import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)

        .then((userCredential) => {

            Swal.fire({
                icon: "success",
                title: "Bienvenido",
                text: "Inicio de sesión correcto",
                timer: 1500,
                showConfirmButton: false
            });

            setTimeout(() => {
                window.location = "dashboard.html";
            }, 1500);

        })

        .catch((error) => {

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message
            });

        });

});