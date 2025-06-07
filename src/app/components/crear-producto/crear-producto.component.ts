import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { Producto, ProductosServiceService } from '../../services/productos-service.service';


@Component({
  selector: 'app-crear-producto',
  imports: [
    FormsModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './crear-producto.component.html',
  styleUrl: './crear-producto.component.css',
  standalone: true
})
export class CrearProductoComponent {

  public dialog = inject(MatDialog);

  productoForm = new FormGroup({
    id: new FormControl(''),
    nombre: new FormControl(''),
    descripcion: new FormControl(''),
    precio: new FormControl(''),
    categoria: new FormControl(''),
    disponibilidad: new FormControl(false),
  });

  constructor(
    private productoService: ProductosServiceService
  ){}

  //Guardamos el nuevo producto
  guardar(): any{
    //Validamos que el form del producto sea valido
    if(this.productoForm.valid){
      //Creamos un nuevo arreglo con los datos del producto a guardar
      const producto: Producto = {
        id: new Date().getTime(), //Guardamos un dato que nunca va a ser igual para el id
        nombre: this.productoForm.value.nombre!,
        precio: parseInt(this.productoForm.value.precio!),
        disponibilidad: this.productoForm.value.disponibilidad ? true : false,
        descripcion: this.productoForm.value.descripcion!,
        categoria: this.productoForm.value.categoria!
      }
      //Llamamos el servicio para guardar el producto nuevo
      this.productoService.saveProduct(producto);
      //Ejecutamos una alerta de confirmacion de creción del nuevo producto
      this.dialog.open(AlertDialogComponent, {
        data:{
          tipo: "confirmacion",
          dato: "creacion"
        },
        width: '40%',
      }).beforeClosed().subscribe(result => {
        //Despues de cerrar la alerta actualizamos la pagina
        location.reload();
      })
    } else {
      //Validamos si el formulario del nombre es valido, y solo mostramos un error para el formulario del precio
      if(!this.productoForm.controls.precio.valid && this.productoForm.controls.nombre.valid){
        this.dialog.open(AlertDialogComponent, {
          data: {
            tipo: "error",
            dato: "precio"
          },
          width: '40%',
        });
      } else if(this.productoForm.controls.precio.valid && !this.productoForm.controls.nombre.valid) { //Validamos si el formulario del precio es valido, y solo mostramos un error para el formulario del nombre
        this.dialog.open(AlertDialogComponent, {
          data: {
            tipo: "error",
            dato: "nombre"
          },
          width: '40%',
        });
      } else { //si los dos formularios son invalidos mostramos una alerta con un error para los dos campos
        this.dialog.open(AlertDialogComponent, {
          data: {
            tipo: "error",
            dato: "todos"
          },
          width: '40%',
        });
      }
    }
  }

}
