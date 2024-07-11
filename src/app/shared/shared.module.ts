import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TabComponent } from "./tab/tab.component";
import { CardComponent } from "./card/card.component";
import { CardFooterDirective } from "./directives/card-footer.directive";
import { CardHeaderDirective } from "./directives/card-header.directive";
import { CardMainDirective } from "./directives/card-main.directive";
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
