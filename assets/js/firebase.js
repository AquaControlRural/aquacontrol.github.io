// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";

// Authentication
import { 
    getAuth,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-auth.js";

// Realtime Database
import { 
    getDatabase,
    ref,
    get
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDlHqueBlBjVRn23N-qdi_z7-xCFlzBaAI",
    authDomain: "sistema-cdc43.firebaseapp.com",
    databaseURL: "https://sistema-cdc43-default-rtdb.firebaseio.com",
    projectId: "sistema-cdc43",
    storageBucket: "sistema-cdc43.firebasestorage.app",
    messagingSenderId: "988299201107",
    appId: "1:988299201107:web:d0ba579ec186e7593794a6"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getDatabase(app);

export function verificarSesion(callback){

    onAuthStateChanged(auth, (usuario)=>{


        if(usuario){

            callback(usuario);


        }else{


            window.location.href="index.html";


        }


    });

}

export async function obtenerRolUsuario(uid){

    const usuariosRef = ref(db,"usuarios");

    const snapshot = await get(usuariosRef);


    if(snapshot.exists()){


        const usuarios = snapshot.val();


        for(const id in usuarios){


            if(id === uid){


                return usuarios[id].rol;


            }


        }


    }


    return null;

}

export async function crearUsuarioAuth(correo,password){

    const resultado = await createUserWithEmailAndPassword(
        auth,
        correo,
        password
    );

    return resultado.user.uid;

}

// ===============================
// CERRAR SESIÓN
// ===============================

export function cerrarSesion(){

    return signOut(auth);

}