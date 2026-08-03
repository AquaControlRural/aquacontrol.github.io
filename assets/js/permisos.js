// ===============================
// PERMISOS POR ROL
// ===============================


export const permisos = {


    Administrador: [

        "dashboard",
        "usuarios",
        "inventario",
        "mantenimiento",
        "calendario",
        "bitacora",
        "reportes",
        "configuracion"

    ],



    Tecnico: [

        "dashboard",
        "inventario",
        "mantenimiento",
        "calendario",
        "reportes"

    ],



    Consulta: [

        "dashboard",
        "calendario",
        "reportes"

    ]


};



// ===============================
// VALIDAR PERMISO
// ===============================


export function tienePermiso(rol, modulo){


    if(!permisos[rol]){

        return false;

    }


    return permisos[rol].includes(modulo);


}