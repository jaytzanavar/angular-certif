import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CardFooterDirective } from "./card-footer.directive";
import { CardHeaderDirective } from "./card-header.directive";
import { TabComponent } from "./tab/tab.component";
import { CardComponent } from "./card/card.component";
import { CardMainDirective } from "./card-main.directive";
import { SelectedTab } from "./directives/selected-tab.directive";

@NgModule({
  imports: [CommonModule],
  declarations: [
    CardFooterDirective,
    CardHeaderDirective,
    CardMainDirective,
    SelectedTab,
    TabComponent,
    CardComponent,
  ],
  exports: [
    CommonModule,
    TabComponent,
    CardComponent,
    SelectedTab,
    CardHeaderDirective,
    CardMainDirective,
    CardFooterDirective,
  ],
})
export class SharedModule {}
