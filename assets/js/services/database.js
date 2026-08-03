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

/*==================================================
    AGREGAR REGISTRO
==================================================*/

export async function agregar(ruta, datos) {

    const nuevaReferencia = push(ref(db, ruta));

    await set(nuevaReferencia, datos);

    return nuevaReferencia.key;

}

/*==================================================
    GUARDAR POR ID (UID)
==================================================*/

export async function guardarUsuario(uid, datos) {

    await set(ref(db, `usuarios/${uid}`), datos);

}

/*==================================================
    OBTENER TODOS
==================================================*/

export async function obtener(ruta) {

    const snapshot = await get(child(ref(db), ruta));

    if (snapshot.exists()) {

        return snapshot.val();

    }

    return {};

}

/*==================================================
    CONTAR REGISTROS
==================================================*/

export async function contar(ruta) {

    const datos = await obtener(ruta);

    return Object.keys(datos || {}).length;

}

/*==================================================
    ACTUALIZAR
==================================================*/

export async function actualizar(ruta, id, datos) {

    await update(ref(db, `${ruta}/${id}`), datos);

}

/*==================================================
    ELIMINAR
==================================================*/

export async function eliminar(ruta, id) {

    await remove(ref(db, `${ruta}/${id}`));

}

/*==================================================
    ESCUCHAR CAMBIOS
==================================================*/

export function escuchar(ruta, callback) {

    onValue(ref(db, ruta), (snapshot) => {

        callback(snapshot.val());

    });

}
/*==================================================
    REGISTRAR BITÁCORA
==================================================*/

export async function registrarBitacora(
    modulo,
    accion,
    descripcion,
    usuario = "Administrador"
) {

    const nuevaReferencia = push(ref(db, "bitacora"));

    await set(nuevaReferencia, {

        modulo,

        accion,

        descripcion,

        usuario,

        fecha: new Date().toLocaleString("es-MX"),

        fechaRegistro: new Date().toISOString()

    });

}