import { auth } from "../firebase.js";

import {

    createUserWithEmailAndPassword

} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

export async function crearUsuario(corre, password){

    const credencial = await createUserWithEmailAndPassword(

        auth,

        corre,

        password

    );

    return credencial.user;

}

import { db } from "../firebase.js";

import {

    ref,

    set

} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

export async function guardarUsuario(uid, datos){

    await set(ref(db, "usuarios/" + uid), datos);

}