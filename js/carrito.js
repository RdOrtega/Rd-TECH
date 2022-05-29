class Carrito {

    //Añadir producto al carrito...
    comprarProducto(e) {
        e.preventDefault();
        //Delegado para agregar al carrito.....
        if (e.target.classList.contains('agregar-carrito')) {
            const producto = e.target.parentElement.parentElement;

            this.leerDatosProducto(producto);
        }
    }

    //Leer datos del producto....
    leerDatosProducto(producto) {
        const infoProducto = {
            imagen: producto.querySelector('img').src,
            titulo: producto.querySelector('h4').textContent,
            precio: producto.querySelector('p span').textContent,
            id: producto.querySelector('button').getAttribute('data-id'),
            cantidad: 1
        }
        let productosLS;
        productosLS = this.obtenerProductosLocalStorage();
        productosLS.forEach(function(productoLS) {
            if (productoLS.id === infoProducto.id) {
                productosLS = productoLS.id;
            }
        });

        if (productosLS === infoProducto.id) {
            Swal.fire({
                type: 'info',
                title: 'Oops...',
                text: 'El producto ya está agregado',
                showConfirmButton: false,
                timer: 2000
            })
        } else {
            this.insertarCarrito(infoProducto);
        }

    }

    //muestra producto seleccionado en carrito....
    insertarCarrito(producto) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src="${producto.imagen}" class="img-fluid img-min">
            </td>
            <td>${producto.titulo}</td>
            <td>${producto.precio}</td>
            <td>
                <a href="#" class="fa fa-times borrar-producto " data-id="${producto.id}"></a>
            </td>
        `;
        listaProductos.appendChild(row);
        this.guardarProductosLocalStorage(producto);

        //abrimos  menu aside del carrito al agreagar productos....
        menuCarrito.classList.add('active');
        cerrarCarrito.classList.add('active');

    }

    //Eliminar el producto del carrito en el DOM.....
    eliminarProductoCarrito(e) {
        e.preventDefault();
        let producto, productoID;
        if (e.target.classList.contains('borrar-producto')) {
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            productoID = producto.querySelector('a').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(productoID);
        this.calcularTotal();
    }

    eliminarProductoModal(e) {
        e.preventDefault();
        let producto, productoID;
        if (e.target.classList.contains('borrar-producto')) {
            e.target.parentElement.parentElement.remove();
            producto = e.target.parentElement.parentElement;
            productoID = producto.querySelector('a').getAttribute('data-id');
        }
        this.eliminarProductoLocalStorage(productoID);
    }

    //Elimina todos los productos
    vaciarCarrito(e) {
        e.preventDefault();
        while (listaProductos.firstChild) {
            listaProductos.removeChild(listaProductos.firstChild);
        }
        this.vaciarLocalStorage();
        return false;
    }

    //Almacenar en el LS
    guardarProductosLocalStorage(producto) {
        let productos = this.obtenerProductosLocalStorage();
        productos.push(producto);
        localStorage.setItem('productos', JSON.stringify(productos));
    }

    //Comprobar que hay elementos en el LS......
    obtenerProductosLocalStorage() {

        let productoLS;
        if (localStorage.getItem('productos') === null) {
            productoLS = [];
        } else {
            productoLS = JSON.parse(localStorage.getItem('productos'));
        }
        return productoLS;
    }

    //Mostrar los productos guardados en el LS...........
    leerLocalStorage() {

        let productosLS = this.obtenerProductosLocalStorage();

        productosLS.forEach(function(producto) {

            //Construir plantilla.....
            const row = document.createElement('tr');
            row.innerHTML = `

                <td>
                    <img src="${producto.imagen}" class="img-fluid img-min">
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <a href="#" class="borrar-producto fa fa-times" data-id="${producto.id}"></a>
                </td>`;

            listaProductos.appendChild(row);
        });
    }

    //Mostrar los productos guardados en el LS en compra.html
    leerLocalStorageCompra() {
        let productosLS = this.obtenerProductosLocalStorage();

        productosLS.forEach(function(producto) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <img src="${producto.imagen}" width=100>
                </td>
                <td>${producto.titulo}</td>
                <td>${producto.precio}</td>
                <td>
                    <input type="number" class="form-control cantidad" min="1" value=${producto.cantidad}>
                </td>
                <td id='subtotales'>${producto.precio * producto.cantidad}</td>
                <td>
                    <a href="#" class="borrar-producto fa fa-times" style="font-size:25px; color:red; text-decoration: none;" data-id="${producto.id}"></a>
                </td>
            `;

            listaCompra.appendChild(row);
        });
    }

    //Eliminar producto por ID del LS
    eliminarProductoLocalStorage(productoID) {
        let productosLS = this.obtenerProductosLocalStorage();

        productosLS.forEach(function(productoLS, index) {
            if (productoLS.id === productoID) {
                productosLS.splice(index, 1);
            }
        });

        localStorage.setItem('productos', JSON.stringify(productosLS));
    }

    //Eliminar todos los datos del LS
    vaciarLocalStorage() {
        localStorage.clear();
    }

    //Procesar pedido
    procesarPedido(e) {
        e.preventDefault();

        if (this.obtenerProductosLocalStorage().length === 0) {
            Swal.fire({
                type: 'error',
                title: 'Oops...',
                text: 'El carrito está vacío, agrega algún producto',
                showConfirmButton: false,
                timer: 3000
            })
        } else {
            location.href = "compra.html";
        }
    }

    //Calcular total.............
    calcularTotal() {

        let productosLS = this.obtenerProductosLocalStorage(),
            total = 0,
            igv = 0,
            subtotal = 0;

        for (let i = 0; i < productosLS.length; i++) {
            let element = Number(productosLS[i].precio * productosLS[i].cantidad);
            total = total + element;
        }

        igv = parseFloat(total * 0.18).toFixed(2);
        subtotal = parseFloat(total - igv).toFixed(2);

        document.getElementById('subtotal').innerHTML = `$ ${subtotal} COP`;
        document.getElementById('igv').innerHTML = `$ ${igv} COP`;
        document.getElementById('total').innerHTML = `$ ${total.toFixed(2)} COP.`;
    }


    obtenerEvento(e) {
        e.preventDefault();
        let id, cantidad, producto, productosLS;
        if (e.target.classList.contains('cantidad')) {
            producto = e.target.parentElement.parentElement;
            id = producto.querySelector('a').getAttribute('data-id');
            cantidad = producto.querySelector('input').value;
            let actualizarMontos = document.querySelectorAll('#subtotales');
            productosLS = this.obtenerProductosLocalStorage();
            productosLS.forEach(function(productoLS, index) {
                if (productoLS.id === id) {
                    productoLS.cantidad = cantidad;
                    actualizarMontos[index].innerHTML = Number(cantidad * productosLS[index].precio);
                }
            });
            localStorage.setItem('productos', JSON.stringify(productosLS));

        } else {
            console.log("click afuera");
        }
    }
}