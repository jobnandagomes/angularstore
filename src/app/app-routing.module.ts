// Importações necessárias do Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Importação do guard de autenticação
import { authGuard } from './core/guards/auth.guard';


// Definição das rotas principais da aplicação
const routes: Routes = [
  // Rota raiz - redireciona para 'courses' quando a URL for vazia
  {
    path: '',
    redirectTo: 'courses',
    pathMatch: 'full' // Garante que só redireciona quando o path for exatamente ''
  },
 
  // Rota para o módulo de cursos
  {
    path: 'courses',
    // Implementação de lazy loading - só carrega o módulo quando necessário
    loadChildren: () => import('./features/courses/courses.module').then(m => m.CoursesModule),
    canActivate: [authGuard] // Protege a rota - só permite acesso para usuários autenticados
  },
 
  // Rota para autenticação (login/registro)
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
    // Nota: Não tem AuthGuard pois precisa ser acessível para usuários não autenticados
  },
 
  // Rota para o carrinho de compras
  {
    path: 'cart',
    loadChildren: () => import('./features/cart/cart.module').then(m => m.CartModule),
    canActivate: [authGuard] // Protege a rota do carrinho
  },
 
  // Rota para o perfil do usuário
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [authGuard] // Protege a rota do perfil
  },
 
  // Rota wildcard - captura qualquer URL não definida e redireciona para 'courses'
  {
    path: '**',
    redirectTo: 'courses'
  }
];


// Decorador do módulo
@NgModule({
  imports: [
    // Registra as rotas no módulo raiz da aplicação
    RouterModule.forRoot(routes)
  ],
  exports: [
    // Exporta RouterModule para que outros módulos possam usar as diretivas de roteamento
    RouterModule
  ]
})
export class AppRoutingModule { } // Módulo de roteamento principal