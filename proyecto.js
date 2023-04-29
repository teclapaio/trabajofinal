

// ** Recuperar los productos  local storage
//** si hay  productos en local Storage carga el carrito con esos productos, sino crea el carrito vacio

let carrito;
if(localStorage.getItem("carrito")) {
  carrito = JSON.parse(localStorage.getItem("carrito"));
} else {
  carrito = [];
}
// Mostrar el carrito si ya hay productos

document.addEventListener('DOMContentLoaded', () => {
     // Verificar si hay elementos en el carrito
   if (carrito.length > 0) {
    // Mostrar los elementos del carrito
    MuestraInicialzaCarrito();
}
   });

// Lista de productos
const coleccionInvierno = [
    {
        nombre:"Remera", 
        id:"001", 
        color:"Negra/lentejuelas", 
        precio: "15000", 
        stock:10, 
        talle:"1"
    },
    {nombre:"Buzo", id:"002", color:"Lila", precio:"23000", stock:12, talle:"2"},
    {nombre:"Pantalon", id:"003", color:"Negro/eco cuero", precio: "32000", stock:17, talle:"1"},
    {nombre:"Pollera", id:"004", color:"Jean", precio:"24000", stock:10, talle:"2"},
    {nombre:"Vestido", id:"005", color:"Rojo", precio:"25000", stock:0, talle:"1"},
    {nombre:"Short", id:"006", color:"Jean", precio:"14000", stock:4, talle:"2"},
    {nombre:"Sweater", id:"007", color:"Marron", precio:"44000", stock:20, talle:"2"},
    {nombre:"Camisa", id:"008", color:"Verde", precio:"24000", stock:10, talle:"2"},
    {nombre:"Campera", id:"009", color:"Rosa", precio:"24000", stock:20, talle:"3"},
    {nombre:"botas", id:"010", color:"negras", precio:"34000", stock:18, talle:"39"}
]


cargarProductos(coleccionInvierno);

function cargarProductos(productosElegidos) {
    const contenedorProductos = document.getElementById("contenedorProductos")

    contenedorProductos.innerHTML = "";
//*** carga los productos */
    productosElegidos.forEach(producto => {

        const div = document.createElement("div")
        div.classList.add("producto");

        div.style.display = "inline-block"; // Añadir propiedad display en línea

        div.id = "producto" + producto.id;
        div.innerHTML = `
        <div class="card" style="width: 15rem; height: 550px; overflow: hidden;">

                <img src="./assets/${producto.nombre + producto.id}.png" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body">
                    <h3>${producto.nombre}</h3>
                    <h6>Color: ${producto.color}</h6>
                    <h6>Precio: ${producto.precio}</h6>
                    <h6>Talle: ${producto.talle}</h6>
                    
                    <form id="form${producto.id}">
                        <label for="contador${producto.id}">Cantidad</label>
                        <input type="number" placeholder="0" id="contador${producto.id}" min="0">
                        <button  class="btn btn-success" id="botonAgregar${producto.id}">AÑADIR AL CARRITO</button>
                        <p id="mensaje${producto.id}"></p>
                        <p id="mensaje${producto.id}" ${producto.stock > 0 ? 'style="display:none;"' : ''}>Sin stock</p>     

                    </form>
                </div>
            </div>
        `;
        
        const botonAgregar = div.querySelector(`#botonAgregar${producto.id}`);
 
        // Deshabilita el botón "agregar" si el stock del producto es cero
        botonAgregar.disabled = producto.stock === 0;
        // Agregar clase "sin-stock" si el stock es cero
        if (producto.stock === 0) {
        const mensaje = div.querySelector(`#mensaje${producto.id}`);
            mensaje.style.display = "block";
            div.classList.add("sin-stock");
        }

        
        contenedorProductos.append(div);
    
        const btn = document.getElementById(`botonAgregar${producto.id}`)

//** si hacen click en el boton "añadir al carrito" */

btn.addEventListener("click", (event) => {
    event.preventDefault();
  
    const cantidadEnCarrito = carrito.find(item => item.id === producto.id)?.cantidadTotalProductos || 0;
    const cantidadProductos = Number(document.getElementById(`contador${producto.id}`).value);
    const cantidadTotal = cantidadEnCarrito + cantidadProductos;
    const productoEnCarrito = carrito.find(item => item.id === producto.id);
    const mensaje = document.getElementById(`mensaje${producto.id}`);

//** si la cantidad de productos es > 0 y no supera stock de producto agrega al carrito sino envia mensaje supera stock
          
           
            if (cantidadProductos > 0 && cantidadTotal <= producto.stock) {
                if (productoEnCarrito) {
                    productoEnCarrito.cantidadTotalProductos = cantidadTotal;
                  } else {
                    carrito.push({
                      nombre: producto.nombre,
                      id: producto.id,
                      precio: producto.precio,
                      stock: producto.stock,
                      color: producto.color,
                      cantidadTotalProductos: cantidadTotal
                    });
                  }
                  localStorage.setItem("carrito", JSON.stringify(carrito));
               
                MuestraInicialzaCarrito()
         
     // Actualiza el LocalStorage
                const form = document.getElementById(`form${producto.id}`)
                form.reset()

              } else {
               
                 if (cantidadProductos == 0) {
                    mensaje.innerHTML = "La cantidad ingresada debe ser superior a 0.";
                } else {
                mensaje.innerHTML = "La cantidad ingresada supera el stock disponible.";
                }   
              }
            })
    // Elimina el mensaje de error 
            const contador = document.getElementById(`contador${producto.id}`);
            contador.addEventListener("input", () => {
                const mensaje = document.getElementById(`mensaje${producto.id}`);
                mensaje.innerHTML = ""; 

                ///
            });
             
        }) 
    };

    //**agrega productos al carrito y actualiza el stock del producto

    const agregarAlCarrito = (objetoCarrito)=>{
    // si un producto con el mismo id ya existe en el carrito, actualiza su cantidad. 
    //Si no existe, se agrega un nuevo objeto al carrito.
  
    const index = carrito.findIndex(item => item.id === objetoCarrito.id);
   
    if (index >= 0) {
        carrito[index].cantidadTotalProductos += objetoCarrito.cantidadTotalProductos;    
    } else {     
        carrito.push(objetoCarrito);   
    }
   
    // restar del stock del producto
    
    const producto = coleccionInvierno.find(item => item.id === objetoCarrito.id);
   
    if (producto) {
       producto.stock -= objetoCarrito.cantidadTotalProductos; 
    }
    
    // Actualiza el LocalStorage
    
    localStorage.setItem("carrito", JSON.stringify(carrito));
    
    montoTotalCarrito()
    
}

const montoTotalCarrito = ()=>{
    // calcula el costo total de los elementos del carrito y lo muestra
    
    const carritoTotal = document.getElementById("carritoTotal")
   
    let totalAPagar = carrito.reduce((acumulador, {precio, cantidadTotalProductos})=>{
        return acumulador + (precio*cantidadTotalProductos)
    }, 0)

    carritoTotal.innerHTML=`<strong style="font-size: 22px; color: blue;">Total a Pagar: $ ${totalAPagar}`
    
}
//** actualiza la visualización del carrito de compras */

function MuestraInicialzaCarrito() {
           
        const productosCarrito = document.getElementById("listaCarrito");
        
        productosCarrito.innerHTML = "";
        
        montoTotalCarrito();
       
        // recorremos el carrito y agregamos cada elemento a la lista
  
        carrito.forEach(({ nombre, id, precio, cantidadTotalProductos }) => {
           
            let productosElegidos = document.createElement("li");
            productosElegidos.innerHTML = `<strong style="font-size: 20px; color: green;"> ${nombre} <br> <strong style="font-size: 15px; color: black">Precio de c/${nombre}: $${precio}<br> Cantidad: ${cantidadTotalProductos} <button id="eliminarCarrito${id}"><i class="bi bi-trash-fill"></i></button>`;
            productosCarrito.appendChild(productosElegidos);

        const botonBorrar = document.getElementById(`eliminarCarrito${id}`);
       
            botonBorrar.addEventListener("click", () => {
                 
                if (cantidadTotalProductos > 1) {
                   // si hay mas de 1 procducto en el carrito actualizamos la cantida
                    carrito = carrito.map((elemento) => {
                        if (elemento.id === id) {
                            cantidadTotalProductos--
                            elemento.cantidadTotalProductos--;        
                        }
                        return elemento;
                    });
                } else {
                    // si la cantidad de productos es 1, eliminamos el elemento del carrito                    
                    carrito = carrito.filter((elemento) => elemento.id !== id);
                }

   //***se guarda en el localStorage  

                let carritoString = JSON.stringify(carrito);
                localStorage.setItem("carrito", carritoString);

    //** Actualizar la pantalla con el nuevo contenido del carrito. */
                MuestraInicialzaCarrito();
            });
        });
    };

//**si hace click en comprar */

    const finCompra = document.getElementById("botonCompraFinal")
    finCompra.addEventListener("click", ()=>{
        confirmarPedido()})

 
    const confirmarPedido = ()=>{
        // Borra el carrito
        carrito = []
        let carritoString = JSON.stringify(carrito)
        localStorage.setItem("carrito", carritoString)
        MuestraInicialzaCarrito()
        let mensaje = document.getElementById("carritoTotal")
        mensaje.innerHTML = " "
      
    } 
