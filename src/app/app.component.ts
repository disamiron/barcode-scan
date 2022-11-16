import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(BarcodeScannerLivestreamComponent)
  public barcodeScanner!: BarcodeScannerLivestreamComponent;
  public barcodeValue: any;

  title = "barcode-scan";

  public ngAfterViewInit() {
    this.barcodeScanner.start();
  }

  public onValueChanges(result: any) {
    this.barcodeValue = result.codeResult.code;
  }
}
