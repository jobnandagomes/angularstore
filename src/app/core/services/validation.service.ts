import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  constructor(private http: HttpClient) {}
  static getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
    let score = 0;
    
    // Comprimento mínimo
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Letras maiúsculas e minúsculas
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    
    // Números
    if (/\d/.test(password)) score++;
    
    // Caracteres especiais
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    // Combinações complexas
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) score++;
    
    return score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';
  }

  static passwordValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const errors: ValidationErrors = {};
    
    if (password.length < 8) {
      errors['minLength'] = true;
    }
    
    if (!/[a-z]/.test(password)) {
      errors['noLowerCase'] = true;
    }
    
    if (!/[A-Z]/.test(password)) {
      errors['noUpperCase'] = true;
    }
    
    if (!/\d/.test(password)) {
      errors['noNumber'] = true;
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors['noSpecialChar'] = true;
    }
    
    return Object.keys(errors).length === 0 ? null : errors;
  }

  static emailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email) return null;
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailRegex.test(email)) {
      return { 'invalidEmail': true };
    }
    
    return null;
  }

  static nameValidator(control: AbstractControl): ValidationErrors | null {
    const name = control.value;
    if (!name) return null;
    
    if (name.length < 3) {
      return { 'minLength': true };
    }
    
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(name)) {
      return { 'invalidCharacters': true };
    }
    
    if (name.trim().split(' ').length < 2) {
      return { 'fullName': true };
    }
    
    return null;
  }

  static phoneValidator(control: AbstractControl): ValidationErrors | null {
    const phone = control.value;
    if (!phone) return null;
    
    const phoneRegex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$/;
    
    if (!phoneRegex.test(phone)) {
      return { 'invalidPhone': true };
    }
    
    return null;
  }

  // Validação assíncrona de email único
  static uniqueEmailValidator(http: HttpClient) {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value;
      if (!email) return of(null);

      return http.get<boolean>(`${environment.apiUrl}/auth/check-email/${email}`).pipe(
        map(isUnique => isUnique ? null : { emailTaken: true }),
        catchError(() => of(null))
      );
    };
  }

  // Validador de confirmação de senha
  static confirmPasswordValidator(passwordKey: string = 'password') {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;

      const password = control.parent.get(passwordKey);
      if (!password) return null;

      return control.value === password.value ? null : { passwordMismatch: true };
    };
  }

  // Validador de CPF
  static cpfValidator(control: AbstractControl): ValidationErrors | null {
    const cpf = control.value?.replace(/[^\d]/g, '');
    if (!cpf) return null;

    if (cpf.length !== 11) return { invalidCpf: true };

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return { invalidCpf: true };

    // Valida os dígitos verificadores
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return { invalidCpf: true };

    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }

    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return { invalidCpf: true };

    return null;
  }

  // Validador de CEP
  static cepValidator(control: AbstractControl): ValidationErrors | null {
    const cep = control.value?.replace(/[^\d]/g, '');
    if (!cep) return null;

    if (cep.length !== 8 || !/^\d{8}$/.test(cep)) {
      return { invalidCep: true };
    }

    return null;
  }

  // Formata mensagens de erro
  static getErrorMessage(errors: ValidationErrors | null): string {
    if (!errors) return '';

    const messages: { [key: string]: string } = {
      required: 'Este campo é obrigatório',
      email: 'Email inválido',
      invalidEmail: 'Email inválido',
      emailTaken: 'Este email já está em uso',
      minLength: 'Muito curto',
      maxLength: 'Muito longo',
      noLowerCase: 'Deve incluir uma letra minúscula',
      noUpperCase: 'Deve incluir uma letra maiúscula',
      noNumber: 'Deve incluir um número',
      noSpecialChar: 'Deve incluir um caractere especial',
      passwordMismatch: 'As senhas não coincidem',
      fullName: 'Digite seu nome completo',
      invalidCharacters: 'Nome contém caracteres inválidos',
      invalidPhone: 'Número de telefone inválido',
      invalidCpf: 'CPF inválido',
      invalidCep: 'CEP inválido'
    };

    // Retorna a primeira mensagem de erro encontrada
    const firstError = Object.keys(errors)[0];
    return messages[firstError] || 'Campo inválido';
  }
}