import { Component, forwardRef, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../../environments/environment";
import { TokenStorage } from "../../../shared/services/token-storage.service";

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CKEditor5Component),
  multi: true
};

const CUSTOM_INPUT_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => CKEditor5Component),
  multi: true
};

declare var ClassicEditor: any;

@Component({
  selector: 'app-ckeditor-v5',
  templateUrl: './ckeditor.component.html',
  styleUrls: ['./ckeditor.component.scss'],
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR,
    CUSTOM_INPUT_VALIDATORS
  ]
})
export class CKEditor5Component implements ControlValueAccessor, OnInit {
  _value: string;

  onChange = (_: any): void => {};
  onTouched = (_: any): void => {};

  @ViewChild('editor') editorWrapper: ElementRef;

  @Input() placeholder: string = '';

  uploadUrl: string;
  token: string;

  editor: any;

  constructor(
    private tokenStorage: TokenStorage,
    private toastrService: ToastrService) {

    this.uploadUrl = `${environment.apiUrl}/editor/image`;
    this.token = tokenStorage.getAccessToken();
  }

  ngOnInit() {
    ClassicEditor
      .create(this.editorWrapper.nativeElement, {
        ckfinder: {
          uploadUrl: this.uploadUrl,
          token: this.token
        }
      })
      .then(editor => {
        this.editor = editor;
        this.editor.setData(this._value);
        this.editor.editing.model.document.on('change', () => {
          this.value = this.editor.getData();
        });
      })
      .catch(error => {
          this.toastrService.error(error);
      });
  }

  get value() { return this._value; }

  set value(v: any) {
    if (this._value === v) return;
    this._value = v;
    this.onChange(this._value);
  }

  writeValue(v): void {
    this._value = v || '';
    if (this.editor) {
      this.editor.setData(this._value);
    }
  }

  validate(c: FormControl): any {
    return (this._value) ? undefined : {
        tinyError: {
            valid: false
        }
    };
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn; 
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn; 
  }
}
