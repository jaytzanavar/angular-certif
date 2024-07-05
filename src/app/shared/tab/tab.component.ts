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
  @Input() title: string;
  @Input() zip: string;
  @Output() selectTab: EventEmitter<number> = new EventEmitter<number>();
  @Output() removeTab: EventEmitter<string> = new EventEmitter<string>();

  @HostListener("click", ["$event"])
  onHostClick(event: Event) {
    console.log("the zip is clicked", this.zip);
    this.selectTab.next(this.id);
  }
  deleteTab(zip): void {
    // locationService.removeLocation(location.zip);
    this.removeTab.next(this.zip);
  }
}
