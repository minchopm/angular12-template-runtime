import {
  AfterViewInit,
  Compiler,
  Component,
  NgModule,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";

@Component({
  selector: 'app-parent',
  template: '<textarea #textAreaElement></textarea><button (click)="interpolateTemplate(textAreaElement)">interpolate</button><div #container></div>'
})
export class ParentComponent implements AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;

  constructor(private compiler: Compiler) {
  }

  interpolateTemplate(textArea) {
    console.log(textArea);
    this.compiler.clearCache();

    // <div>This is the dynamic template. Test value: {{test}}</div>
    // <span *ngIf='test == "some other value"'> conditions are working</span>
    // Define the component using Component decorator.
    const component = Component({
      template: textArea.value ,
      styles: [':host {color: red}']
    })(class {
      test = 'some value';
    });

    // Define the module using NgModule decorator.
    const module = NgModule({
      imports: [
        BrowserModule
      ],
      declarations: [component]
    })(class {
    });

    // Asynchronously (recommended) compile the module and the component.
    this.compiler.compileModuleAndAllComponentsAsync(module)
      .then(factories => {
        // Get the component factory.
        const componentFactory = factories.componentFactories[0];
        // Create the component and add to the view.
        const componentRef = this.container.createComponent(componentFactory);
        // Modifying the property and triggering change detection.
        setTimeout(() => componentRef.instance.test = 'some other value', 2000);
      });
  }

  ngAfterViewInit() {
    // Must clear cache.
  }
}
