import {
  Component,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "app-tab",
  templateUrl: "./tab.component.html",
  styleUrls: ["./tab.component.css"],
})
export class TabComponent {
  @Input() id: number;
  @Input() tab_title: string;
  @Output() selectTab: EventEmitter<number> = new EventEmitter<number>();
  @Output() removeTab: EventEmitter<number> = new EventEmitter<number>();

  @HostListener("click", ["$event"])
  onHostClick(event: Event) {
    this.selectTab.next(this.id);
  }
  deleteTab(): void {
    // locationService.removeLocation(location.zip);
    this.removeTab.next(this.id);
  }
}
