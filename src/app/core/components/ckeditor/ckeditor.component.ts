import { Component, forwardRef, OnInit, ViewChild, ElementRef, Input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, FormControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { environment } from "../../../../environments/environment";
import { TokenStorage } from "../../../shared/services/token-storage.service";
import { AppSettingService } from "../../../shared/services/app-setting.service";

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

declare const CustomEditorLoader: any;

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
  @Input() html: boolean = false;

  uploadUrl: string;
  token: string;

  editor: any;

  constructor(
    private appSettings: AppSettingService,
    private tokenStorage: TokenStorage,
    private toastrService: ToastrService) {

    this.uploadUrl = `https://api.${this.appSettings.baseData.name}.staffconnect-app.com/api/editor/image`;
    this.token = this.tokenStorage.getAccessToken();
  }

  ngOnInit() {
    const ClassicEditor = new CustomEditorLoader(this.html).getEditor();
    ClassicEditor
      .create(this.editorWrapper.nativeElement, {
        heading: {
          options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
          ]
        },
        fontFamily: {
          options: [
            'default',
            'Arial, Helvetica, sans-serif',
            'Courier New, Courier, monospace',
            'Georgia, serif',
            'Lucida Sans Unicode, Lucida Grande, sans-serif',
            'Tahoma, Geneva, sans-serif',
            'Times New Roman, Times, serif',
            'Trebuchet MS, Helvetica, sans-serif',
            'Verdana, Geneva, sans-serif'
          ]
        },
        fontSize: {
          options: [
            'tiny',
            'small',
            'default',
            'big',
            'huge'
          ]
        },
        ckfinder: {
          uploadUrl: this.uploadUrl,
          token: this.token
        }
      })
      .then(editor => {
        this.editor = editor;
        this.editor.setData(this.getFilteredValue(this._value));
        this.editor.editing.model.document.on('change', () => {
          this.value =  this.getOriginValue(this.editor.getData());
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
      this.editor.setData(this.getFilteredValue(this._value));
    }
  }

  getFilteredValue(value): string {
    if (this.html) {
      return value;
    } else {
      const matches = value.match(/\[{2}.*?\]{2}/g);
      if (matches) {
        for (const match of matches) {
          value = value.replace(match, `\`${match}\``);
        }
        return value;
      } else {
        return value;
      }
    }
  }

  getOriginValue(value): string {
    if (this.html) {
      return value;
    } else {
      const matches = value.match(/\`\[{2}.*?\]{2}\`/g);
      if (matches) {
        for (const match of matches) {
          value = value.replace(match, match.slice(1, match.length - 1));
        }
        return value;
      } else {
        return value;
      }
    }
  }

  validate(c: FormControl): any {
    return true; /* TODO Investigate what was wrong with previous validation */
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn; 
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn; 
  }
}
