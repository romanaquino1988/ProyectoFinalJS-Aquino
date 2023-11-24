//Capturo div contenedor con DOM
const divContenedor = document.getElementById("contenedor")

//Array vacio para acumular lo que va eligiendo el usuario + local storage
let menuElegido = JSON.parse(localStorage.getItem("menuElegido")) || []

// Agrego asincronia con fetch al array de objetos creado en productos.json

const getProducts = async () => {
    const response = await fetch("productos.json")
    const data = await response.json()

    //Recorro el array de productos y muestro elementos  en html
for (let c of data){
    let contenedor = document.createElement("div")
    contenedor.className = "card"
    contenedor.innerHTML =`
    <img src="${c.img}" class="imagen-platos">
    <h3 class="titulo-platos">${c.nombre}</h3>
    <p class="descripcion-platos">${c.descripcion}</p>
    <p class="precio-platos">$${c.precio}</p>
    `
    divContenedor.appendChild(contenedor)

//Creo botón de agregar al carrito
    let carrito = document.createElement("button")
    carrito.innerText = "Agregar al carrito"
    carrito.className = "agregar-presupuesto"
    
    divContenedor.appendChild(carrito)

//Agrego el escuchador y evento click al botón
    carrito.addEventListener("click", ()=>{

      const repeat = menuElegido.some((sumarProducto) => sumarProducto.id === c.id)
      if (repeat){
        menuElegido.map((producto) => {
            if (producto.id === c.id){
                producto.cantidad++
            }
        })
      }else {
        menuElegido.push({
            id: c.id,
            img: c.img,
            nombre: c.nombre,
            precio: c.precio,
            cantidad: c.cantidad,
        })
    }

//Agrego cartel de producto agregado con librerias
    Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Producto agregado",
        showConfirmButton: false,
        timer: 900
      });

    console.log(menuElegido)
    contadorCarrito()
    saveLocal()
    })
}

//Ver productos en carrito con un modal

//Capturo elementos del HTML con DOM
const verCarrito = document.getElementById("vercarrito")
const modalContenedor = document.getElementById("modalcontenedor")
const cantidadCarrito = document.getElementById("cantidadcarrito")   

//Función para mostrar y hacer funcionar el modal 
    const pintarCarrito = ()=> {
        modalContenedor.innerHTML = ""
        modalContenedor.style.display = "flex"
         const modalHEader = document.createElement("div")
         modalHEader.className = "modal-header"
         modalHEader.innerHTML = `
            <h1 class="modal-header-titulo">Menú elegido</h1>
         `
        modalContenedor.appendChild(modalHEader)

        const modalButton = document.createElement("h1")
        modalButton.innerText = "x"
        modalButton.className = "modal-header-button"

        modalButton.addEventListener("click", ()=>{
            modalContenedor.style.display = "none"
        })

        modalHEader.appendChild(modalButton)
        
//Función para mostrar los elementos del carrito en HTML
        menuElegido.forEach((comidas) => {
            let contenidoCarrito = document.createElement("div")
            contenidoCarrito.className = "contenido-modal"
            contenidoCarrito.innerHTML =`
            <img src="${comidas.img}">
            <h3>${comidas.nombre}</h3>
            <p>$${comidas.precio}</p>
            <span class="restar"> - </span>
            <p>Cantidad: ${comidas.cantidad}</p>
            <span class="sumar"> + </span>
            <p>Total: $${comidas.cantidad * comidas.precio}
            <span class="borrar-productos"> ❌ </span>
            `
            modalContenedor.appendChild(contenidoCarrito)

// Funciónes para sumar o restar productos en carrito
            let restar = contenidoCarrito.querySelector(".restar")
            restar.addEventListener("click", ()=>{
                if (comidas.cantidad !== 1){
                    comidas.cantidad--
                }     
                pintarCarrito();
                saveLocal()
            });

            let sumar = contenidoCarrito.querySelector(".sumar")
            sumar.addEventListener("click", ()=>{
                comidas.cantidad++
                saveLocal()
                pintarCarrito();
            })

//función para eliminar productos carrito

            let eliminar = contenidoCarrito.querySelector(".borrar-productos")
            eliminar.addEventListener("click", ()=>{
                eliminarProducto(comidas.id)

//Agrego cartel producto eliminado con librerias
                Swal.fire({
                    position: "top-center",
                    icon: "error",
                    title: "Producto eliminado",
                    showConfirmButton: false,
                    timer: 900
                  });
            })
        })

 //Método para calcular total carrito       
        const presupuesto = menuElegido.reduce((accum, p) => accum + p.precio * p.cantidad, 0)

        const presupuestoTotal = document.createElement("div")
        presupuestoTotal.className = "contenido-presupuesto"
        presupuestoTotal.innerHTML=`
        El total es de $${presupuesto}
        `
        modalContenedor.appendChild(presupuestoTotal)
}

verCarrito.addEventListener("click", pintarCarrito);

const eliminarProducto = (id) => {
    const buscarId = menuElegido.find((e) => e.id === id);

    menuElegido = menuElegido.filter((carritoId) => {
        return carritoId !== buscarId;
    })
    contadorCarrito()
    saveLocal()
    pintarCarrito()
}

//Función para sumar la cantidad de elementos del carrito
const contadorCarrito = () => {
    cantidadCarrito.style.display = "block"
    const carritolength =  menuElegido.length

    localStorage.setItem("carritoLength", JSON.stringify(carritolength))

    cantidadCarrito.innerText = JSON.parse(localStorage.getItem("carritoLength"))

}
contadorCarrito()
}

getProducts()


//Seteando local storage
const saveLocal = () => {
    localStorage.setItem("menuElegido", JSON.stringify(menuElegido));
}

