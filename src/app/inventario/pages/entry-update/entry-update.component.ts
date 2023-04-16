import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

import { EntryG } from '../../interfaces/entry.interface';

@Component({
  selector: 'app-entry-update',
  templateUrl: './entry-update.component.html',
  styleUrls: ['./entry-update.component.scss'],
})
export class EntryUpdateComponent implements OnInit {
  i!: number;
  partidaG!: EntryG;
  nameProduct!: string;

  miFormulario: FormGroup = this.fb.group({
    costo_kilo: ['', [Validators.required, Validators.min(1)]],
    subtotal: ['', [Validators.required, Validators.min(1)]],
    total_cajas: ['', [Validators.required, Validators.min(1)]],
    total_tapas: ['', [Validators.required, Validators.min(1)]],
  });

  get costo_kiloErrorMsg(): string {
    const errors = this.miFormulario.get('costo_kilo')?.errors;

    if (errors?.['required']) {
      return 'El campo costo por kilo es obligatorio';
    } else if (errors?.['min']) {
      return 'El campo costo por kilo debe ser mayor a 0';
    }
    return '';
  }

  get subtotalErrorMsg(): string {
    const errors = this.miFormulario.get('subtotal')?.errors;

    if (errors?.['required']) {
      return 'El subtotal es obligatorio';
    } else if (errors?.['min']) {
      return 'El subtotal debe ser mayor a 0';
    }
    return '';
  }

  get total_casjasErrorMsg(): string {
    const errors = this.miFormulario.get('total_cajas')?.errors;

    if (errors?.['required']) {
      return 'El campo total cajas es obligatorio';
    } else if (errors?.['min']) {
      return 'El campo total cajas debe ser mayor a 0';
    }
    return '';
  }

  get total_tapasErrorMsg(): string {
    const errors = this.miFormulario.get('total_tapas')?.errors;

    if (errors?.['required']) {
      return 'El campo total tapas es obligatorio';
    } else if (errors?.['min']) {
      return 'El campo total tapas debe ser mayor a 0';
    }
    return '';
  }

  constructor(
    private fb: FormBuilder,
    public modalRef: MdbModalRef<EntryUpdateComponent>
  ) {}

  ngOnInit(): void {
    this.miFormulario.get('costo_kilo')?.setValue(this.partidaG.costo_kilo);
    this.miFormulario.get('subtotal')?.setValue(this.partidaG.subtotal);
    this.miFormulario.get('total_cajas')?.setValue(this.partidaG.total_cajas);
    this.miFormulario.get('total_tapas')?.setValue(this.partidaG.total_tapas);
  }

  campoNoValido(campo: string) {
    return (
      this.miFormulario.get(campo)?.invalid &&
      this.miFormulario.get(campo)?.touched
    );
  }

  entryUpdtae() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }
    const partidaG = { partidaG: this.miFormulario.value, i: this.i };
    this.modalRef.close(partidaG);
  }
}
