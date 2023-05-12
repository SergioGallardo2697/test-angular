import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from './core/services/users.services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from './core/interface/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form!: FormGroup;

  constructor(private fb: FormBuilder,
    private readonly usersService: UsersService,
    private readonly _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      nombres: ['', Validators.required],
      apellidoPaterno: ['', Validators.required],
      apellidoMaterno: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^[0-9]*$")]],
      genero: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      console.error('Formulario invalido');
      return;
    }

    const user = this.form.value as User;

    this.usersService.create(user).subscribe({
        next: (user: User) => {
          this.form.reset();
          this._snackBar.open('El usuario ha sido guardado con exito.', 'Guardado', { duration: 3000 });
        },
        error: (err: Error) => {
          this._snackBar.open('Ha ocurrido un error al guardar el usuario.', 'Error', { duration: 3000 });
      },
        complete: () => {}
    });
  }

  soloNumeros(event: any) {
    let inputChar = String.fromCharCode(event.charCode);

    if (!/\d/.test(inputChar)) {
      event.preventDefault();
    }
  }
}
