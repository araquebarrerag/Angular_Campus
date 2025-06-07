import { Component, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Producto, ProductosServiceService } from '../../services/productos-service.service';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-lista-productos',
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatSelect, 
    MatLabel, 
    MatOption, 
    MatIcon,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    AsyncPipe
  ],
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css',
  standalone: true
})
export class ListaProductosComponent implements OnInit{

  myControl = new FormControl('');
  public load: boolean = false;
  public productos: Producto[] = [];
  public categorias : string[] = [];
  public filteredOptions: Observable<string[]>;
  public dialog = inject(MatDialog);
  public selectedCategoria = "";

  listaProductosBusquedaForm = new FormGroup({
    selectedDisponibilidad: new FormControl(''),
    selectedCategoria: new FormControl('')
  });

  constructor(
    private productService: ProductosServiceService
  ){
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  //Cargamos todos los productos
  loadProducts(): any{
    //Cargamos los productos con el servicio
    this.productos = this.productService.getProducts();
    //Creamos un nuevo arreglo para las categorias
    let arregloCategorias: any[] = [];
    //Recorremos el arreglo de los productos
    for(let i of this.productos){
      //Agregamos en el arreglo cada una de las categorias
      arregloCategorias.push(i.categoria ? i.categoria : 'N/A');
    }
    //Validamos que todas las categorias de los arreglos ya esten guardadas
    if(arregloCategorias.length == this.productos.length){
      //Actualizamos el arreglo de categorias, para que no nos muestre categorias duplicadas
      this.categorias = [...new Set(arregloCategorias)];
      //Ponemos la variable load en true, para que nos muestre la lista de los productos
      this.load = true;
    }
  }

  //Buscamos productos por disponibilidad
  findDisponibilidad(){
    //Guardamos todos los productos
    this.loadProducts();
    //Guardamos en una variable el dato del filtro de busqueda
    const disponibilidad = this.listaProductosBusquedaForm.get('selectedDisponibilidad')?.value
    //Validamos que se halla seleccionado un dato, si no se van a seguir mostrando todos los productos
    if(disponibilidad) {
      //Guardamos en una variable la disponibilidad, dependiendo del dato que se selecciono en el filtro
      const disponible = disponibilidad == "1" ? true : false;
      //Realizamos la busqueda de los productos filtrando por la disponibilidad seleccionada
      this.productos = this.productos.filter(producto => producto.disponibilidad == disponible);
    }
  }

  //Buscamos productos por categoria
  findCategoria(){
    //Guardamos todos los productos
    this.loadProducts();
    //Guardamos en una variable el dato del filtro de busqueda
    this.listaProductosBusquedaForm.get('selectedCategoria')?.setValue(this.myControl.value)
    const categoria = this.listaProductosBusquedaForm.get('selectedCategoria')?.value
    //Validamos que se halla seleccionado un dato, si no se van a seguir mostrando todos los producto
    if(categoria) {
      //Realizamos la busqueda de los productos filtrando por la categoria seleccionada
      this.productos = this.productos.filter(producto => (producto.categoria ? producto.categoria : 'N/A') == categoria);
    }
  }

  //Eliminamos un producto en especifico
  delete(producto: Producto){
    //Mostramos una alerta de confirmación, para que el usuario seleccione si si desea eliminar el producto
    this.dialog.open(AlertDialogComponent,{
      data: {
        tipo: "confirmacion",
        dato: "eliminar",
        producto: producto.nombre
      },
      width: '40%',
    })
    .beforeClosed().subscribe(result => {
      //Validamos si el resultado del usuario fue confirmando la eliminación
      if(result){
        //Eliminamos el producto llamando el servicio
        this.productService.deleteProduct(producto.id);
        //Actualizamos los productos, para que ya no nos muestre el que eliminamos
        this.loadProducts();
      }
    });
  }

  //Filtramos los datos para el select de la busqueda por categoria
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.categorias.filter(option => option.toLowerCase().includes(filterValue));
  }

}
