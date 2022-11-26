import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BarcodeFormat } from "@zxing/library";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public title: string = "Barcode Scanner";

  allowedFormats = [BarcodeFormat.EAN_13];

  public barcodeValue: string | null = null;

  public started = true;

  public isManuallLogic: boolean = false;

  constructor(private _fb: FormBuilder, private _cdr: ChangeDetectorRef) {}

  public manuallForm: FormGroup = this._fb.group({
    barcode: [null, Validators.required],
  });

  public enterManually() {
    if (this.isManuallLogic) {
      this.started = true;
    } else {
      this.started = false;
    }
    this.isManuallLogic = !this.isManuallLogic;
  }

  public scanSuccessHandler(e: any) {
    if (e) {
      this.started = false;
      this.barcodeValue = e;
    }
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
