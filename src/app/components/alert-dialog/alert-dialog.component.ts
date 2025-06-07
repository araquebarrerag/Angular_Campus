import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  imports: [CommonModule, MatDialogContent],
  templateUrl: './alert-dialog.component.html',
  styleUrl: './alert-dialog.component.css'
})
export class AlertDialogComponent implements OnInit{

  public tipo: string = "";
  public dato: string = "";
  public producto: string = "";

  //Creamos el modal que tenemos abierto
  public dialogRef = inject(MatDialogRef<AlertDialogComponent>);

  //Creamos la variable que nos va a traer la data (Para ver si es una confirmacion o un error)
  public data = inject<any>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    this.tipo = this.data.tipo;
    this.dato = this.data.dato;
    this.producto = this.data.producto;
  }

  confirmar(confirmacion: boolean){
    //Para la confirmacion de eliminacion, cerramos la ventana y ademas enviamos lo que el usuario selecciono
    this.dialogRef.close(confirmacion);
  }

  cerrar(){
    //Cerramos la ventana
    this.dialogRef.close();
  }

}
