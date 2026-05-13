import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  template: `
    <div class="about-me-container">
      <mat-card class="hero-card">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">Sobre Mim</h1>
            <p class="hero-subtitle">
              Desenvolvedor Angular & Especialista em Arquitetura Web
            </p>
            <p class="hero-description">
              Desenvolvedor apaixonado por criar soluções inovadoras e escaláveis,
              com foco em Angular, TypeScript e boas práticas de desenvolvimento.
            </p>
          </div>
          <div class="hero-image">
            <img src="assets/images/profile-placeholder.jpg" alt="Foto de perfil" class="profile-image">
          </div>
        </div>
      </mat-card>

      <div class="content-grid">
        <mat-card class="expertise-card">
          <mat-card-header>
            <mat-card-title>Especialidades</mat-card-title>
            <mat-card-subtitle>Áreas de atuação profissional</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-chip-set>
              <mat-chip>Angular</mat-chip>
              <mat-chip>TypeScript</mat-chip>
              <mat-chip>Node.js</mat-chip>
              <mat-chip>Clean Code</mat-chip>
              <mat-chip>Design Patterns</mat-chip>
              <mat-chip>DevOps</mat-chip>
            </mat-chip-set>
          </mat-card-content>
        </mat-card>

        <mat-card class="experience-card">
          <mat-card-header>
            <mat-card-title>Experiência Profissional</mat-card-title>
            <mat-card-subtitle>Trajetória em desenvolvimento web</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="experience-item">
              <h3>Tech Lead - Descomplica</h3>
              <p>
                Liderança técnica em projetos de grande escala, implementação de
                arquiteturas escaláveis e mentoria de desenvolvedores.
              </p>
            </div>
            <mat-divider></mat-divider>
            <div class="experience-item">
              <h3>Desenvolvedor Angular Senior</h3>
              <p>
                Desenvolvimento de aplicações web robustas, implementação de padrões
                de projeto e otimização de performance.
              </p>
            </div>
            <mat-divider></mat-divider>
            <div class="experience-item">
              <h3>Especialista em Arquitetura</h3>
              <p>
                Design e implementação de arquiteturas escaláveis, microserviços
                e integração contínua.
              </p>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="contact-card">
          <mat-card-header>
            <mat-card-title>Contato & Redes Sociais</mat-card-title>
            <mat-card-subtitle>Conecte-se comigo profissionalmente</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="contact-links">
              <button mat-stroked-button class="contact-button">
                <mat-icon>email</mat-icon>
                E-mail Profissional
              </button>
              <button mat-stroked-button class="contact-button">
                <mat-icon>linked_camera</mat-icon>
                LinkedIn
              </button>
              <button mat-stroked-button class="contact-button">
                <mat-icon>code</mat-icon>
                GitHub
              </button>
              <button mat-stroked-button class="contact-button">
                <mat-icon>article</mat-icon>
                Blog/Artigos
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
      background: #f5f5f5;
      min-height: 100vh;
    }

    .about-me-container {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .hero-card {
      background: linear-gradient(135deg, #1976d2, #64b5f6);
      color: white;
      border-radius: 12px;
      overflow: hidden;
    }

    .hero-content {
      display: flex;
      align-items: center;
      gap: 32px;
      padding: 48px;
    }

    .hero-text {
      flex: 1;
    }

    .hero-title {
      font-size: 2.5rem;
      margin: 0 0 16px;
      font-weight: bold;
    }

    .hero-subtitle {
      font-size: 1.5rem;
      margin: 0 0 24px;
      opacity: 0.9;
    }

    .hero-description {
      font-size: 1.1rem;
      line-height: 1.6;
      margin: 0;
      opacity: 0.8;
    }

    .hero-image {
      flex-shrink: 0;
    }

    .profile-image {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
    }

    .expertise-card,
    .experience-card,
    .contact-card {
      height: 100%;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    mat-card-header {
      padding: 24px 24px 0;
    }

    mat-card-content {
      padding: 24px;
    }

    mat-card-title {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 8px;
    }

    mat-card-subtitle {
      font-size: 1rem;
      opacity: 0.7;
    }

    .experience-item {
      padding: 16px 0;
    }

    .experience-item:first-child {
      padding-top: 0;
    }

    .experience-item h3 {
      font-size: 1.2rem;
      font-weight: bold;
      color: #1976d2;
      margin: 0 0 8px;
    }

    .experience-item p {
      margin: 0;
      line-height: 1.5;
      color: rgba(0, 0, 0, 0.7);
    }

    mat-divider {
      margin: 16px 0;
    }

    mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .contact-links {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .contact-button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 8px;
      padding: 12px 16px;
    }

    @media (max-width: 768px) {
      :host {
        padding: 16px;
      }

      .hero-content {
        flex-direction: column-reverse;
        text-align: center;
        padding: 32px;
      }

      .hero-title {
        font-size: 2rem;
      }

      .hero-subtitle {
        font-size: 1.25rem;
      }

      .profile-image {
        margin-bottom: 24px;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }

      .contact-links {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AboutMeComponent {}