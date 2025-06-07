import { Injectable } from '@angular/core';

//Creamos una interfaz para el modelo del producto
export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string; //Usamos la anotación '?' para decir que la propieda es opcional
  precio: Number;
  categoria?: string;
  disponibilidad: boolean;
}

@Injectable({
  providedIn: 'root'
})

export class ProductosServiceService {

  productos: Producto[] = [];
  
  constructor() {
  }

  //Creamos el servicio donde vamos a listar los productos
  getProducts(): any {
    //Traemos los productos del localStorage
    let arrayProductosStorage = JSON.parse(localStorage.getItem('arrayProducts') || "[]");
    //Retornamos el arreglo que nos trae el localStorage
    return arrayProductosStorage;
  }

  //Traemos el producto con un id en especifico
  getProductById(id: any): any{
    let arrayStorage = this.getProducts();
    //Filtramos los productos almacenados en el localStorage para que elimine el del id que envio
    let producto_encontrado = arrayStorage.filter((producto: Producto) => producto.id == parseInt(id));
    //Retornamos el producto del id que encontro
    return producto_encontrado[0];
  }

  //Creamos el servicio donde vamos a guardar un producto en el localStorage
  saveProduct(producto: Producto): any {
    let arrayStorage = this.getProducts();
    //Comprobamos si el arreglo es un array
    if(Array.isArray(arrayStorage)){
      //Añadimos dentro del array un producto nuevo
      arrayStorage.push(producto);
    } else {
      //Creamos un array con el nuevo producto
      arrayStorage = [JSON.stringify(producto)];
    }

    //Guardamos en el localStorage el nuevo producto
    localStorage.setItem('arrayProducts', JSON.stringify(arrayStorage));
    //Retornamos el nuevo producto que guardamos
    return producto;
  }

  //Creamos el servicio donde vamos a actualizar un producto del localStorage
  updateProduct(producto: Producto){
    let arrayStorage = this.getProducts();

    //Buscamos el indice del objeto del producto a actualizar
    const indice = arrayStorage.findIndex( (product: Producto) =>  product.id === producto.id );
    //Creamos el producto actualizado
    let producto_actualizado = {
      id: producto.id,
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      categoria: producto.categoria,
      disponibilidad: producto.disponibilidad
    };
    //Actualizamos el elemento con ese indice
    arrayStorage[indice] = producto_actualizado;
    //Guardamos el nuevo arreglo en el localStorage
    localStorage.setItem('arrayProducts', JSON.stringify(arrayStorage));
  }
  
  //Creamos el servicio donde vamos a eliminar un producto del localStorage
  deleteProduct(id: any): any{
    let arrayStorage = this.getProducts();
    //Filtramos los productos almacenados en el localStorage para que elimine el del id que envio
    let nuevoArrayProductos = arrayStorage.filter((producto: Producto) => producto.id !== parseInt(id));
    //Actualizamos los productos almacenados en el localStorage
    localStorage.setItem('arrayProducts', JSON.stringify(nuevoArrayProductos));
  }
}
