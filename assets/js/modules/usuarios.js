import {
    agregar,
    escuchar,
    actualizar,
    eliminar,
    registrarBitacora
} from "../services/database.js";
import { exportarExcel } from "../utils/excel.js";
let modal;
let idEditar = null;
let datosUsuarios = {};
let textoBusqueda = "";

export function initUsuarios() {

    modal = new bootstrap.Modal(
        document.getElementById("modalUsuario")
    );

    cargarUsuarios();

    document
        .getElementById("btnGuardarUsuario")
        .addEventListener("click", guardarUsuario);

    document.addEventListener("click", (e) => {

        const editar = e.target.closest(".btn-edit");

        if (editar) {

            editarUsuario(editar.dataset.id);

        }

    });
    document.addEventListener("click", (e) => {

        const eliminarBtn = e.target.closest(".btn-delete");

        if (!eliminarBtn) return;

        eliminarUsuario(eliminarBtn.dataset.id);

    });
    document
    .getElementById("buscarUsuario")
    .addEventListener("input", (e) => {

        textoBusqueda = e.target.value.toLowerCase();

        cargarUsuarios();

    });
    document
    .getElementById("btnExcel")
    .addEventListener("click", exportarUsuariosExcel);

}

function exportarUsuariosExcel(){

    const datos=[];

    Object.values(datosUsuarios).forEach(usuario=>{

        datos.push({

            Nombre:usuario.nombre,

            Correo:usuario.correo,

            Rol:usuario.rol,

            Estado:usuario.estado,

            Fecha:usuario.fechaRegistro || ""

        });

    });

    exportarExcel({

        titulo:"Reporte de Usuarios",

        archivo:"Usuarios.xlsx",

        hoja:"Usuarios",

        datos

    });

}
function pintarTabla(datos){

    const tabla = document.querySelector("#tablaUsuarios tbody");

    tabla.innerHTML = "";

    if(!datos){

        tabla.innerHTML=`
        <tr>
            <td colspan="6" class="text-center">
                No hay usuarios registrados.
            </td>
        </tr>`;

        return;

    }

    let contador = 1;

    Object.entries(datos).forEach(([id, usuario])=>{

        const buscar = (
            usuario.nombre +
            usuario.correo +
            usuario.rol +
            usuario.estado
        ).toLowerCase();

        if(!buscar.includes(textoBusqueda)) return;

        tabla.innerHTML += `
        <tr>

            <td>${contador++}</td>

            <td><strong>${usuario.nombre}</strong></td>

            <td>${usuario.correo}</td>

            <td>
                <span class="badge bg-primary">
                    ${usuario.rol}
                </span>
            </td>

            <td>
                <span class="badge ${usuario.estado=="Activo"?"badge-activo":"badge-inactivo"}">
                    ${usuario.estado}
                </span>
            </td>

            <td class="text-center">

                <button
                    class="btn-action btn-edit"
                    data-id="${id}">

                    <i class="bi bi-pencil"></i>

                </button>

                <button
                    class="btn-action btn-delete"
                    data-id="${id}">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>
        `;

    });

}
async function eliminarUsuario(id){

    const respuesta = await Swal.fire({

        title: "¿Eliminar usuario?",

        text: "Esta acción no se puede deshacer.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#dc3545",

        cancelButtonColor: "#6c757d",

        confirmButtonText: "Sí, eliminar",

        cancelButtonText: "Cancelar"

    });

    if(!respuesta.isConfirmed) return;
    
    await registrarBitacora(

        "Usuarios",

        "Eliminación",

        `Se eliminó el usuario ${datosUsuarios[id].nombre}`

    );

    await eliminar("usuarios", id);
    await eliminar("usuarios", id);

    Swal.fire({

        icon: "success",

        title: "Usuario eliminado",

        timer: 1500,

        showConfirmButton: false

    });

}
async function guardarUsuario() {

    const nombre = document.getElementById("txtNombre").value.trim();

    const correo = document.getElementById("txtCorreo").value.trim();

    const password = document.getElementById("txtPassword").value.trim();

    const rol = document.getElementById("cmbRol").value;

    const estado = document.getElementById("cmbEstado").value;

    if (!nombre || !correo) {

        Swal.fire({

            icon:"warning",

            title:"Campos incompletos",

            text:"Completa todos los campos."

        });

        return;

    }

    // EDITAR

    if (idEditar != null) {

        await actualizar("usuarios", idEditar, {

            nombre,

            correo,

            rol,

            estado

        });
        await registrarBitacora(

            "Usuarios",

            "Edición",

            `Se editó el usuario ${nombre}`

        );

        limpiarFormulario();

        modal.hide();

        return;

    }

    // NUEVO

    if (password == "") {

        Swal.fire({

            icon:"warning",

            title:"Campos incompletos",

            text:"Ingresa una contraseña."

        });

        return;

    }

    await agregar("usuarios", {

        nombre,

        correo,

        password,

        rol,

        estado,

        fechaRegistro: new Date().toISOString()

    });
    await registrarBitacora(

        "Usuarios",

        "Registro",

        `Se registró el usuario ${nombre}`

    );

    limpiarFormulario();

    modal.hide();

}

function cargarUsuarios(){

    escuchar("usuarios",(datos)=>{

        datosUsuarios = datos || {};

        pintarTabla(datosUsuarios);

    });

}

function editarUsuario(id) {

    idEditar = id;

    const usuario = datosUsuarios[id];

    document.getElementById("txtNombre").value = usuario.nombre;

    document.getElementById("txtCorreo").value = usuario.correo;

    document.getElementById("cmbRol").value = usuario.rol;

    document.getElementById("cmbEstado").value = usuario.estado;

    document.getElementById("txtPassword").parentElement.style.display = "none";

    document.querySelector(".modal-title").textContent = "Editar Usuario";

    document.getElementById("btnGuardarUsuario").textContent = "Actualizar";

    modal.show();

}

function limpiarFormulario() {

    document.getElementById("txtNombre").value = "";

    document.getElementById("txtCorreo").value = "";

    document.getElementById("txtPassword").value = "";

    document.getElementById("cmbRol").selectedIndex = 0;

    document.getElementById("cmbEstado").selectedIndex = 0;

    document.getElementById("txtPassword").parentElement.style.display = "block";

    document.querySelector(".modal-title").textContent = "Nuevo Usuario";

    document.getElementById("btnGuardarUsuario").textContent = "Guardar";

    idEditar = null;

}