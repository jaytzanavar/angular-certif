import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from "@angular/core";

@Directive({
  selector: "[seletedTab]",
})
export class SelectedTab {
  // this code is redundant just made for POC purposes
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  @Input() seletedTab!: {
    tabIndex: number;
    selectedIndex: number;
  };

  @HostListener("click") onClick() {
    const { tabIndex, selectedIndex } = this.seletedTab;
    this.renderer.setStyle(
      this.el.nativeElement,
      "backgroundColor",
      "rgba(57, 147, 231, 0.836)"
    );
    if (tabIndex === selectedIndex)
      this.renderer.setStyle(
        this.el.nativeElement,
        "backgroundColor",
        "rgba(127, 185, 240, 0.836)"
      );
    else {
      this.renderer.setStyle(
        this.el.nativeElement,
        "backgroundColor",
        "rgba(57, 147, 231, 0.836)"
      );
    }
  }
}
