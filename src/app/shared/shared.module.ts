import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CardFooterDirective } from "./card-footer.directive";
import { CardHeaderDirective } from "./card-header.directive";
import { TabComponent } from "./tab/tab.component";
import { CardComponent } from "./card/card.component";
import { CardMainDirective } from "./card-main.directive";

@NgModule({
  imports: [CommonModule],
  declarations: [
    CardFooterDirective,
    CardHeaderDirective,
    CardMainDirective,
    TabComponent,
    CardComponent,
  ],
  exports: [
    CommonModule,
    TabComponent,
    CardComponent,
    CardHeaderDirective,
    CardMainDirective,
    CardFooterDirective,
  ],
})
export class SharedModule {}
