import { db } from "./firebase.js";

import { 
    ref,
    onValue
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-database.js";



const contador = document.getElementById("contadorNotificaciones");



function cargarNotificaciones(){


    const bitacoraRef = ref(db, "bitacora");


    onValue(bitacoraRef, (snapshot)=>{


        let cantidad = 0;


        if(snapshot.exists()){


            const datos = snapshot.val();


            cantidad = Object.keys(datos).length;


        }



        if(contador){


            if(cantidad > 0){


                contador.textContent = cantidad;
                contador.style.display = "block";


            }else{


                contador.style.display = "none";


            }


        }


    });



}



cargarNotificaciones();