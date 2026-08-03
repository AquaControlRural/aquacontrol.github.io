import { escuchar } from "../services/database.js";
import { exportarExcel } from "../utils/excelReportes.js";
import { exportarPDF } from "../utils/pdfReportes.js";
// ==========================================
// DATOS GLOBALES DEL CENTRO DE REPORTES
// ==========================================

let reporteGlobal = {

    usuarios:{},

    comunidades:{},

    pozos:{},

    bombas:{},

    inventario:{},

    mantenimientos:{},

    bitacora:{}

};
let datosCargados = false;

// ==========================================
// VARIABLES DE GRAFICAS
// ==========================================

let grafEstado = null;
let grafCategoria = null;
let grafCostos = null;
let grafBombas = null;



// ==========================================
// INICIALIZAR MODULO
// ==========================================

export function initReportes(){


    cargarReportes();


    document
    .getElementById("btnExcel")
    ?.addEventListener(
        "click",
        ()=>{


            if(!datosCargados){

                Swal.fire({

                    icon:"warning",

                    title:"Cargando datos",

                    text:"Espera unos segundos antes de exportar."

                });

                return;

            }


            const reporte =
            prepararReporteExcel();


            exportarExcel(reporte);


        }
    );
    document
    .getElementById("btnPDF")
    ?.addEventListener(
    "click",
    ()=>{

    const reporte =
    prepararReporteExcel();

    exportarPDF(reporte);

    }
    );


}



// ==========================================
// CARGAR DATOS FIREBASE
// ==========================================

function cargarReportes(){


Promise.all([


    new Promise(resolve =>
        escuchar("usuarios",resolve)
    ),


    new Promise(resolve =>
        escuchar("comunidades",resolve)
    ),


    new Promise(resolve =>
        escuchar("pozos",resolve)
    ),


    new Promise(resolve =>
        escuchar("bombas",resolve)
    ),


    new Promise(resolve =>
        escuchar("inventario",resolve)
    ),


    new Promise(resolve =>
        escuchar("mantenimientos",resolve)
    ),


    new Promise(resolve =>
        escuchar("bitacora",resolve)
    )


])


.then(([

usuarios,
comunidades,
pozos,
bombas,
inventario,
mantenimientos,
bitacora

])=>{


reporteGlobal.usuarios = usuarios || {};

reporteGlobal.comunidades = comunidades || {};

reporteGlobal.pozos = pozos || {};

reporteGlobal.bombas = bombas || {};

reporteGlobal.inventario = inventario || {};

reporteGlobal.mantenimientos = mantenimientos || {};

reporteGlobal.bitacora = bitacora || {};
datosCargados = true;


procesarDatos(

    mantenimientos || {},
    inventario || {},
    bombas || {}

);



llenarTabla(
    mantenimientos || {}
);


});


}




// ==========================================
// PROCESAR INFORMACION
// ==========================================

function procesarDatos(

mantenimientos,

inventario,

bombas

){



let totalMant = 0;

let costoTotal = 0;

let bajoStock = 0;

let totalMaterial = 0;

let totalBombas = 0;



const estadoMant = {

    Pendiente:0,

    "En proceso":0,

    Finalizado:0

};



const categoriaInv = {};

const estadoBomba = {};

const costosMes = new Array(12).fill(0);



// ---------------- MANTENIMIENTOS ----------------


Object.values(mantenimientos)
.forEach(m=>{


totalMant++;


costoTotal += Number(m.costo || 0);



if(estadoMant[m.estado] !== undefined)

estadoMant[m.estado]++;



if(m.fecha){


let fecha = new Date(m.fecha);


if(!isNaN(fecha))

costosMes[
    fecha.getMonth()
]
+=Number(m.costo || 0);


}



});





// ---------------- INVENTARIO ----------------


Object.values(inventario)
.forEach(i=>{


totalMaterial++;


if(
Number(i.cantidad)
<=
Number(i.stockMinimo)
)

bajoStock++;



categoriaInv[i.categoria]
=
(categoriaInv[i.categoria]||0)+1;



});





// ---------------- BOMBAS ----------------


Object.values(bombas)
.forEach(b=>{


totalBombas++;


estadoBomba[b.estado]
=
(estadoBomba[b.estado]||0)+1;



});




actualizarTarjetas(

totalMant,

costoTotal,

totalBombas,

totalMaterial,

bajoStock

);



crearGraficas(

estadoMant,

categoriaInv,

costosMes,

estadoBomba

);



}





// ==========================================
// TARJETAS
// ==========================================


function actualizarTarjetas(

mant,

costo,

bombas,

materiales,

bajo

){


document.getElementById(
"repMantenimientos"
).textContent = mant;



document.getElementById(
"repCosto"
).textContent =
"$"+costo.toLocaleString();



document.getElementById(
"repBombas"
).textContent = bombas;



document.getElementById(
"repInventario"
).textContent = materiales;



document.getElementById(
"repBajoStock"
).textContent = bajo;


}




// ==========================================
// GRAFICAS
// ==========================================


function crearGraficas(

estadoMant,

categoriaInv,

costosMes,

estadoBomba

){



if(grafEstado)
grafEstado.destroy();


if(grafCategoria)
grafCategoria.destroy();


if(grafCostos)
grafCostos.destroy();


if(grafBombas)
grafBombas.destroy();




// ESTADOS


grafEstado = new Chart(

document.getElementById(
"grafEstadoCanvas"
),

{


type:"pie",


data:{


labels:Object.keys(estadoMant),


datasets:[{

data:Object.values(estadoMant)

}]


}


}


);





// INVENTARIO


grafCategoria = new Chart(

document.getElementById(
"grafCategoriaCanvas"
),

{


type:"doughnut",


data:{


labels:Object.keys(categoriaInv),


datasets:[{

data:Object.values(categoriaInv)

}]


}



}


);





// COSTOS


grafCostos = new Chart(

document.getElementById(
"grafCostosCanvas"
),

{


type:"line",


data:{


labels:[

"Ene",
"Feb",
"Mar",
"Abr",
"May",
"Jun",
"Jul",
"Ago",
"Sep",
"Oct",
"Nov",
"Dic"

],


datasets:[{

label:"Costo",

data:costosMes

}]


}



}


);






// BOMBAS


grafBombas = new Chart(

document.getElementById(
"grafBombasCanvas"
),

{


type:"bar",


data:{


labels:Object.keys(estadoBomba),


datasets:[{

label:"Bombas",

data:Object.values(estadoBomba)

}]


}



}


);



}






// ==========================================
// PREPARAR EXPORTACION EXCEL
// ==========================================


function prepararReporteExcel(){



const reporte = {


resumen:{

titulo:"Resumen General",

datos:[

{

modulo:"Usuarios",

cantidad:Object.keys(
reporteGlobal.usuarios
).length

},

{

modulo:"Comunidades",

cantidad:Object.keys(
reporteGlobal.comunidades
).length

},


{

modulo:"Pozos",

cantidad:Object.keys(
reporteGlobal.pozos
).length

},


{

modulo:"Bombas",

cantidad:Object.keys(
reporteGlobal.bombas
).length

},


{

modulo:"Inventario",

cantidad:Object.keys(
reporteGlobal.inventario
).length

},


{

modulo:"Mantenimientos",

cantidad:Object.keys(
reporteGlobal.mantenimientos
).length

}


]


},


usuarios:{
titulo:"Usuarios",
datos:Object.values(reporteGlobal.usuarios)
},


comunidades:{
titulo:"Comunidades",
datos:Object.values(reporteGlobal.comunidades)
},


pozos:{
titulo:"Pozos",
datos:Object.values(reporteGlobal.pozos)
},


bombas:{
titulo:"Bombas",
datos:Object.values(reporteGlobal.bombas)
},


inventario:{
titulo:"Inventario",
datos:Object.values(reporteGlobal.inventario)
},


mantenimientos:{
titulo:"Mantenimientos",
datos:Object.values(reporteGlobal.mantenimientos)
},


bitacora:{
titulo:"Bitacora",
datos:Object.values(reporteGlobal.bitacora)
}


};



console.log(
"AquaControl Reporte:",
reporte
);


return reporte;


}





// ==========================================
// TABLA
// ==========================================


function llenarTabla(mantenimientos){


const tbody =
document.querySelector(
"#tablaReportes tbody"
);


if(!tbody)
return;


tbody.innerHTML="";



Object.values(mantenimientos)
.forEach(m=>{


let color="bg-warning";


if(m.estado==="Finalizado")
color="bg-success";


if(m.estado==="En proceso")
color="bg-primary";



tbody.innerHTML += `

<tr>

<td>${m.fecha || ""}</td>

<td>${m.pozoNombre || ""}</td>

<td>${m.bombaNombre || ""}</td>

<td>${m.tipo || ""}</td>

<td>${m.tecnico || ""}</td>


<td>

<span class="badge ${color}">

${m.estado || ""}

</span>


</td>


<td>

$${Number(m.costo || 0)
.toLocaleString()}

</td>


</tr>

`;



});



}