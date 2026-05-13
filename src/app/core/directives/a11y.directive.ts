// Diretiva avançada de acessibilidade
@Directive({ selector: '[appA11y]' })
export class A11yDirective implements AfterViewInit {
  private observer: MutationObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.initFocusManagement();
    this.initAriaLiveRegions();
    this.setupMutationObserver();
  }

  private initFocusManagement() {
    this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '-1');
    this.renderer.listen(this.el.nativeElement, 'focus', this.trapFocus);
  }

  private setupMutationObserver() {
    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes') {
          this.validateAriaAttributes();
        }
      });
    });

    this.observer.observe(this.el.nativeElement, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }
} 