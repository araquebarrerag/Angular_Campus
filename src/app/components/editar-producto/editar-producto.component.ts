import { Component, inject } from '@angular/core';
import { Producto, ProductosServiceService } from '../../services/productos-service.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-producto',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './editar-producto.component.html',
  styleUrl: './editar-producto.component.css',
  standalone: true
})
export class EditarProductoComponent{

  public id: string = "";
  public producto: Producto;
  public dialog = inject(MatDialog);

  productoForm: FormGroup;

  constructor(
    private productoService: ProductosServiceService
  ){
    //Traemos los datos que enviamos por medio de la URL
    const urlParams = new URLSearchParams(window.location.search);
    //Guardamos en una variable el id que enviamos en la url
    this.id = urlParams.get("id")!;
    //Consultamos el producto que coincida con el id
    this.producto = this.productoService.getProductById(this.id);
    
    this.productoForm = new FormGroup({
      id: new FormControl(this.producto.id),
      nombre: new FormControl(this.producto.nombre),
      descripcion: new FormControl(this.producto.descripcion),
      precio: new FormControl(this.producto.precio),
      categoria: new FormControl(this.producto.categoria),
      disponibilidad: new FormControl(this.producto.disponibilidad)
    });
  }

  //Actualizamos el producto
  actualizar(){
    //Gurdamos en una variable los valores del producto a actualizar
    const producto_Actualizado: Producto = this.productoForm.value;
    //Mostramos una alerta de confirmación de actualizacion del producto
    this.dialog.open(AlertDialogComponent,{
      data: {
        tipo: "edicion",
        dato: "edicion",
        producto: producto_Actualizado.nombre
      },
      width: '40%',
    }).beforeClosed().subscribe( result => {
      //Actualizamos el producto con el servicio
      this.productoService.updateProduct(producto_Actualizado);
      //Retornamos al usuario a la vista de todos los productos
      location.replace("/lista");
    });
  }
}
