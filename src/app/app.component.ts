import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { BarcodeFormat } from "@zxing/library";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public title: string = "Barcode Scanner";

  allowedFormats = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.DATA_MATRIX,
    BarcodeFormat.EAN_13,
  ];

  public barcodeValue: string | null = null;

  public started = true;

  public isManuallLogic: boolean = false;

  constructor(private _fb: FormBuilder) {}

  public manuallForm: FormGroup = this._fb.group({
    barcode: [null, Validators.required],
    tryHarder: [false],
  });

  public enterManually() {
    if (this.isManuallLogic) {
      this.barcodeValue = null;
      this.started = true;
    } else {
      this.barcodeValue = null;
      this.started = false;
    }
    this.isManuallLogic = !this.isManuallLogic;
  }

  public scanSuccessHandler(e: any) {
    if (e && (e[0] === "4" || e[0] === "7") && e.length === 13) {
      this.started = false;
      this.barcodeValue = e;
    }
  }

  public changeTryHarder(event: MatCheckboxChange) {
    this.manuallForm.patchValue({
      tryHarder: event.checked,
    });
  }

  public newScan() {
    this.barcodeValue = null;
    this.manuallForm.patchValue({
      barcode: null,
    });
    this.started = true;
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
