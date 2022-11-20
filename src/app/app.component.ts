import { AfterViewInit, Component, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { QuaggaJSResultObject } from "@ericblade/quagga2";
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

  public isManuallLogic: boolean = false;

  constructor(private _fb: FormBuilder) {}

  public manuallForm: FormGroup = this._fb.group({
    barcode: [null, Validators.required],
  });

  public ngAfterViewInit() {
    this.barcodeScanner.start();
  }

  public onValueChanges(result: QuaggaJSResultObject) {
    this.barcodeValue = result.codeResult.code;
    this.barcodeScanner.stop();
    this.started = false;
  }

  public barcodeScanStarted() {
    this.started = true;
  }

  public enterManually() {
    if (this.isManuallLogic) {
      this.barcodeScanner.start();
    } else {
      this.barcodeScanner.stop();
    }
    this.isManuallLogic = !this.isManuallLogic;
  }

  public newScan() {
    this.barcodeValue = null;
    this.manuallForm.patchValue({
      barcode: null,
    });
    this.barcodeScanner.start();
  }

  public submit() {
    if (this.manuallForm.invalid) {
      return;
    }
    this.isManuallLogic = false;
    this.barcodeValue = this.manuallForm.value.barcode;
    this.started = false;
  }
}
