import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from "@angular/core";
import Quagga, { QuaggaJSResultObject } from "@ericblade/quagga2";
import { BarcodeScannerLivestreamComponent } from "ngx-barcode-scanner";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewInit {
  @ViewChild(BarcodeScannerLivestreamComponent)
  public barcodeScanner!: BarcodeScannerLivestreamComponent;
  public title: string = "Barcode Scanner";

  public barcodeValue: string | null = null;

  public started = false;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public ngAfterViewInit() {
    this.barcodeScanner.start();
  }

  public onValueChanges(result: QuaggaJSResultObject) {
    if (result.codeResult.code) {
      this.barcodeValue = result.codeResult.code;
      this.barcodeScanner.stop();
      this.started = false;
    }
  }

  public barcodeScanStarted() {
    this.started = true;
  }

  public newScan() {
    this.barcodeScanner.start();
  }
}
