// ======================================================
// excelReportes.js
// Exportación profesional AquaControl Rural
// ======================================================

import { imagenBase64 } from "./image.js";




// ======================================================
// EXPORTAR EXCEL COMPLETO
// ======================================================

export async function exportarExcel(reporte){


    const workbook = new ExcelJS.Workbook();


    workbook.creator = "AquaControl Rural";

    workbook.lastModifiedBy = "AquaControl Rural";

    workbook.created = new Date();

    workbook.modified = new Date();




    // Crear hojas

    for(const modulo of Object.keys(reporte)){


        await crearHoja(

            workbook,

            modulo,

            reporte[modulo].titulo,

            reporte[modulo].datos

        );


    }




    // Descargar archivo


    const buffer =
    await workbook.xlsx.writeBuffer();



    saveAs(

        new Blob(
            [buffer],
            {
                type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            }
        ),

        "AquaControl_Reportes.xlsx"

    );



}







// ======================================================
// CREAR HOJA
// ======================================================


async function crearHoja(

    workbook,

    nombre,

    titulo,

    datos

){



const hoja =
workbook.addWorksheet(
    nombre.toUpperCase()
);




hoja.properties.defaultRowHeight = 22;





// ======================================================
// CONFIGURACION PAGINA
// ======================================================


hoja.pageSetup = {


    orientation:"landscape",

    paperSize:9,

    fitToPage:true,

    fitToWidth:1,

    margins:{


        left:0.3,

        right:0.3,

        top:0.5,

        bottom:0.5,

        header:0.3,

        footer:0.3


    }


};







// ======================================================
// LOGO
// ======================================================


try{


    const logo64 =
    await imagenBase64(
        "assets/img/logo.png"
    );



    const logo =
    workbook.addImage({

        base64:logo64,

        extension:"png"

    });



    hoja.addImage(

        logo,

        {

            tl:{
                col:0,
                row:0
            },


            ext:{

                width:85,

                height:85

            }

        }

    );



}
catch(error){


    console.log(
        "No se pudo cargar logo",
        error
    );


}







// ======================================================
// TITULO
// ======================================================


hoja.mergeCells(
    "B1:F1"
);



const tituloCelda =
hoja.getCell(
    "B1"
);



tituloCelda.value =
"AquaControl Rural";



tituloCelda.font={


    size:22,

    bold:true,

    color:{
        argb:"1565C0"
    }


};



tituloCelda.alignment={


    horizontal:"center",

    vertical:"middle"


};







// ======================================================
// SUBTITULO
// ======================================================


hoja.mergeCells(
    "B2:F2"
);



const sub =
hoja.getCell(
    "B2"
);



sub.value =
titulo;



sub.font={


    size:15,

    bold:true,

    color:{
        argb:"37474F"
    }


};



sub.alignment={


    horizontal:"center"


};







// ======================================================
// FECHA
// ======================================================


hoja.getCell("A4").value =
"Fecha generación:";



hoja.getCell("B4").value =
new Date()
.toLocaleString("es-MX");



hoja.getCell("A4").font={
    bold:true
};








// ======================================================
// DATOS VACIOS
// ======================================================


if(

!datos ||
datos.length===0

){


    hoja.getCell("A6").value =
    "Sin información disponible";


    return;


}






// ======================================================
// ENCABEZADOS
// ======================================================


const columnas =
Object.keys(
    datos[0]
);



hoja.addRow([]);



hoja.addRow(
    columnas
);





const filaEncabezado =
hoja.getRow(6);



filaEncabezado.height=28;





filaEncabezado.eachCell(

(cell)=>{


    cell.font={


        bold:true,

        color:{
            argb:"FFFFFFFF"
        }


    };



    cell.fill={


        type:"pattern",

        pattern:"solid",

        fgColor:{
            argb:"1976D2"
        }


    };



    cell.alignment={


        horizontal:"center",

        vertical:"middle"


    };



    cell.border={


        top:{
            style:"thin"
        },

        left:{
            style:"thin"
        },

        bottom:{
            style:"thin"
        },

        right:{
            style:"thin"
        }


    };



}

);









// ======================================================
// DATOS
// ======================================================


datos.forEach(

(registro,index)=>{


const fila =
hoja.addRow(

Object.values(registro)

);



fila.height=22;



fila.eachCell(

(cell)=>{



cell.border={


    top:{
        style:"thin"
    },

    left:{
        style:"thin"
    },

    bottom:{
        style:"thin"
    },

    right:{
        style:"thin"
    }


};




cell.alignment={

    vertical:"middle"

};






// filas alternadas


if(index % 2 === 0){


cell.fill={


    type:"pattern",

    pattern:"solid",

    fgColor:{
        argb:"F5F9FF"
    }


};


}



}

);



}

);









// ======================================================
// AUTO AJUSTE COLUMNAS
// ======================================================


hoja.columns.forEach(

(columna)=>{


let max=12;



columna.eachCell(

(cell)=>{


const valor =
cell.value
?
cell.value.toString()
:
"";



if(valor.length > max)

max = valor.length;



}

);



columna.width =
Math.min(
    max+4,
    45
);



}

);









// ======================================================
// FILTRO
// ======================================================


hoja.autoFilter={


    from:{

        row:6,

        column:1

    },


    to:{

        row:6 + datos.length,

        column:columnas.length

    }


};









// ======================================================
// CONGELAR ENCABEZADO
// ======================================================


hoja.views=[

{

state:"frozen",

ySplit:6,

activeCell:"A7"

}

];








// ======================================================
// PIE DE PAGINA
// ======================================================


hoja.headerFooter.oddFooter =

"&LGenerado por AquaControl Rural" +

"&RPágina &P de &N";





}