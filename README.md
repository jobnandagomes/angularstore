# My Tech Store Hub -- Dev.JobNandaGomes

Esta Tech Store Hub é um projeto academico de Fernanda Gomes | na prática: DEV. FLUTTER E REACT | <https://www.linkedin.com/in/jobnandagomes/> |  

E deixou de ser apenas um projeto academico e agora funciona como uma plataforma unificada para:

- vender livros tecnicos, cursos e servicos de consultoria;
- publicar artigos, guias e materiais gratuitos focados em estudantes e profissionais da area;
- fortalecer a marca pessoal do autor, apresentando credenciais, depoimentos e formas diretas de contato.

# My Tech Store Hub 


Todo o front-end foi construído com Angular 17+ e segue boas praticas de performance, acessibilidade e escalabilidade para suportar novos produtos e campanhas.

## Tecnologias Utilizadas
- Angular 17+ com componentes standalone
- Angular Material e estilos customizados
- NgRx para estado global (carrinho, usuario, preferencias de UI)
- JSON Server como mock de API
- RxJS para programacao reativa
- Cypress e Karma/Jasmine (suporte a testes unitarios e E2E)

## Principais Experiencias

### Loja de Livros e Servicos
- Catalogo unificado com filtros por tema, nivel e formato.
- Paginas de produto enriquecidas com sinopse, sumario, depoimentos e CTAs (comprar, agendar mentoria, baixar preview).
- Carrinho contextual com bundles, cupons e cross-sell de materiais.
- Plano de checkout integravel a gateways (Stripe/Pagar.me) com recibos e controle de impostos.

### Blog de Ciberseguranca
- Listagem de artigos com categorias (fundamentos, carreira, threat intelligence, ferramentas, mindset).
- Paginas de artigo otimizadas para SEO (meta tags, estrutura heading, links relacionados).
- Biblioteca de materiais gratuitos (checklists, e-books, planilhas) com mecanismos de lead capture.
- Planejamento para sitemap, RSS e compartilhamento social.

### Marca Pessoal e Autoridade
- Pagina “Sobre Mim” com narrativa, certificacoes, palestras e valores.
- Sessao de provas sociais com depoimentos reais e logos de parceiros.
- Integracao com agenda (mentorias/palestras), newsletter e canais de comunidade.
- Base para medir a jornada (blog → lead → venda) via analytics e pixel tracking.

## Estrutura do Projeto (resumo)
```
tech-store/
├─ mock-server/           # Dados mockados (JSON Server)
├─ src/
│  ├─ app/
│  │  ├─ core/            # Servicos globais (auth, ui, notificacoes, guards)
│  │  ├─ shared/          # Componentes compartilhados / design system
│  │  ├─ features/
│  │  │  ├─ about-me/     # Marca pessoal e provas sociais
│  │  │  ├─ blog/         # Conteudo editorial (em evolucao)
│  │  │  ├─ catalog/      # Livros, cursos e servicos
│  │  │  ├─ cart/         # Carrinho e checkout
│  │  │  ├─ auth/         # Fluxos de autenticacao e onboarding
│  │  │  └─ student/      # Dashboard do cliente/aluno
│  │  └─ app.routes.ts    # Rotas raiz
│  ├─ environments/       # Configuracoes por ambiente
│  └─ styles/             # Estilos globais e tokens
```

## Modelagem de Dominio (visao atual)
- **User**: informacoes pessoais, preferencias, historico de compras, papeis (estudante, mentor, cliente enterprise).
- **Product**: livros, cursos, servicos, bundles, estoque digital, tags.
- **Content**: artigos, materiais gratuitos, taxonomias, SEO metadata.
- **Order**: itens do carrinho, transacoes, recibos, status de entrega/download.
- **Engagement**: newsletter opt-in, eventos, agendamentos, funis de onboarding.

## API Mock Disponivel (versao atual)
- `GET /api/courses` – lista cursos (serao expandidos para livros/servicos).
- `GET /api/courses/:id` – detalhe do curso/produto.
- `POST /api/auth/register` – registro.
- `POST /api/auth/login` – login.
- `GET /api/student/courses` – area do cliente.
- Proximos passos: endpoints para blog posts, materiais gratuitos, pedidos, newsletters.

## Setup e Execucao
1. Instale as dependencias  
   ```bash
   npm install
   ```
2. Suba o servidor mock  
   ```bash
   npm run server
   ```
3. Inicie o frontend  
   ```bash
   ng serve
   ```
4. Acesse `http://localhost:4200`

> **Credenciais de teste**: `teste@gmail.com / teste222`

## Recursos Implementados
- Responsividade completa (mobile first).
- Alternancia de tema claro/escuro via `UIService`.
- Side menu contextual com links para loja, blog, sobre mim e area autenticada.
- Loading overlay, interceptors de autenticacao e servico de notificacao unificados.
- Guardas de rota e refresh token em revisao para atender ao novo escopo.

## Roadmap de Evolucao
- [ ] Consolidar unico `AuthService` (core) e alinhar guardas/interceptors.
- [ ] Modelar dominio de produtos (livros, servicos, bundles) com SEO-friendly routing.
- [ ] Criar modulo de blog (listagem, detalhe, markdown/CMS, sitemap).
- [ ] Implementar landing pages de materiais gratuitos com automacao de leads.
- [ ] Integrar checkout a gateway de pagamento e emitir recibos/notas.
- [ ] Configurar analytics (GA4/Matomo) com eventos de funil e dashboards.
- [ ] Trabalhar internacionalizacao (pt/en/es) e adequacao LGPD/termos legais.
- [ ] Integrar automacoes de marketing (newsletter, follow-up, onboarding).

## Contribuicao
1. Faça um fork do repositorio.
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`).
3. Realize commits (`git commit -m "feat: descricao"`).
4. Envie (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request descrevendo o impacto e testes realizados.

## Suporte e Contato
- Suporte tecnico: `suporte@techstore.com`
- Parcerias, palestras e mentorias: utilize o formulario na pagina Sobre Mim (quando publicado).
- Dificuldades ou ideias: abra uma issue neste repositorio.

## Licenca
Projeto licenciado sob MIT. Consulte `LICENSE` para mais detalhes.
