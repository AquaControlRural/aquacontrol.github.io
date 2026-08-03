import { verificarSesion } from "./firebase.js";


    document.addEventListener("DOMContentLoaded", () => {


        verificarSesion((usuario)=>{


            console.log("Usuario autenticado:", usuario.email);


            cargarVista("dashboard");


        });




    document.addEventListener("click", (e) => {


        const enlace = e.target.closest(".menu-link");


        if(!enlace) return;


        e.preventDefault();


        const vista = enlace.dataset.view;


        cargarVista(vista);



        // Cerrar menú en móviles

        const offcanvas = document.getElementById("sidebarMovil");


        if(offcanvas){


            const instancia = bootstrap.Offcanvas.getInstance(offcanvas);


            if(instancia){

                instancia.hide();

            }

        }


    });



    // ==============================
    // CERRAR SESIÓN
    // ==============================

    const btnCerrarSesion = document.getElementById("btnCerrarSesion");


    if(btnCerrarSesion){


        btnCerrarSesion.addEventListener("click", async ()=>{


            const resultado = await Swal.fire({

                title: "¿Cerrar sesión?",
                text: "Se cerrará la sesión actual",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, cerrar",
                cancelButtonText: "Cancelar"


            });



            if(resultado.isConfirmed){


                try {


                    const { cerrarSesion } = await import("./firebase.js");


                    await cerrarSesion();


                    window.location.href = "index.html";


                } catch(error){


                    Swal.fire(
                        "Error",
                        error.message,
                        "error"
                    );


                }


            }


        });


    }


});