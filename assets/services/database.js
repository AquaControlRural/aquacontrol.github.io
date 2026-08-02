import { db } from "../firebase.js";

import {
    ref,
    set,
    push,
    get,
    child,
    update,
    remove,
    onValue
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-database.js";

/* ===============================
   AGREGAR
================================ */

export async function agregar(ruta, datos){

    const nuevaReferencia = push(ref(db, ruta));

    await set(nuevaReferencia, datos);

    return nuevaReferencia.key;

}

/* ===============================
   OBTENER TODOS
================================ */

export async function obtener(ruta){

    const snapshot = await get(child(ref(db), ruta));

    if(snapshot.exists()){

        return snapshot.val();

    }

    return {};

}

/* ===============================
   ACTUALIZAR
================================ */

export async function actualizar(ruta,id,datos){

    await update(ref(db, `${ruta}/${id}`), datos);

}

/* ===============================
   ELIMINAR
================================ */

export async function eliminar(ruta,id){

    await remove(ref(db, `${ruta}/${id}`));

}

/* ===============================
   ESCUCHAR CAMBIOS
================================ */

export function escuchar(ruta,callback){

    onValue(ref(db,ruta),(snapshot)=>{

        callback(snapshot.val());

    });

}