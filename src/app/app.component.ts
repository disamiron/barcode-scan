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

  public errorMessage: string | null = null;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  public ngAfterViewInit() {
    // this.initializeScanner();
    this.barcodeScanner.start();
  }

  public onValueChanges(result: QuaggaJSResultObject) {
    this.barcodeValue = result.codeResult.code;
  }
  public onStarted() {
    console.log("started");
  }
  public initializeScanner(): Promise<void> {
    this.barcodeValue = null;
    if (
      !navigator.mediaDevices ||
      !(typeof navigator.mediaDevices.getUserMedia === "function")
    ) {
      this.errorMessage =
        "getUserMedia is not supported. Please use Chrome on Android or Safari on iOS";
      this.started = false;
    }

    return Quagga.CameraAccess.enumerateVideoDevices()
      .then(() => {
        return this.initializeScannerWithDevice(undefined);
      })
      .catch((error) => {
        this.errorMessage = `Failed to enumerate devices: ${error}`;
        this.started = false;
      });
  }

  private initializeScannerWithDevice(
    preferredDeviceId: string | undefined
  ): Promise<void> {
    const constraints: MediaTrackConstraints = {};

    if (preferredDeviceId) {
      constraints.deviceId = preferredDeviceId;
    } else {
      constraints.facingMode = "environment";
    }

    return Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints,
          area: {
            top: "25%",
            right: "10%",
            left: "10%",
            bottom: "25%",
          },
          target: document.querySelector("#scanner-container")!,
        },
        decoder: {
          readers: ["ean_reader"],
          multiple: false,
        },
        locate: false,
      },
      (err) => {
        if (err) {
          this.errorMessage = `Initialization error: ${err}`;
          this.started = false;
        } else {
          Quagga.start();
          this.started = true;
          this.changeDetectorRef.detectChanges();
          Quagga.onDetected((res) => {
            if (res.codeResult.code) {
              this.onBarcodeScanned(res.codeResult.code);
            }
          });
        }
      }
    );
  }
  onBarcodeScanned(code: string) {
    this.barcodeValue = code;
    this.changeDetectorRef.detectChanges();
    this.started = false;
    Quagga.stop();
  }
}
