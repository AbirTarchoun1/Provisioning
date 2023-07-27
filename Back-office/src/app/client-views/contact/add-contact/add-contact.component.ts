import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CKEditorComponent } from 'ckeditor4-angular';
import { ContactService } from 'src/app/services/contact.service';
@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent implements OnInit, AfterViewInit {

  @ViewChild('ckeditor') ckeditor: any;
  submitted = false;
  constructor(public contactService: ContactService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    if (this.ckeditor && this.ckeditor.instance) {
      this.ckeditor.instance.setData('');
    }
  }
  onSubmit() {
    let contactBody = {
      contactId : this.contactService.form.value.contactId,
      text: this.contactService.form.value.text,
      object: this.contactService.form.value.object,
      email: this.contactService.form.value.email,
      companyName: this.contactService.form.value.companyName,
      createdDate: new Date(),
      lastModificatedDate: new Date(),
    };

    if (this.contactService.form.valid) {

      this.contactService.createContact(contactBody).subscribe((res) => {
        // Clear the form after submission
        this.contactService.form.reset();
        
        
        
        // Reset CKEditor data and validity
        setTimeout(() => {
          if  (this.ckeditor && this.ckeditor.instance) {
            this.ckeditor.instance.setData('');
            this.contactService.form.controls['text'].setErrors(null);
            this.contactService.form.controls['text'].markAsUntouched();
            this.contactService.form.controls['text'].markAsPristine();
           
          }
          
        }, 0);
  
        // Clear validation errors for other fields
        Object.keys(this.contactService.form.controls).forEach(key => {
          if (key !== 'text') {
            this.contactService.form.get(key)?.setErrors(null);
          }
        });

        //snackBar success 
        this._snackBar.open(" Submited Successfully", + '' + "K" + '' + '⚡', {
          duration: 8000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
          panelClass: ["mat-toolbar", "mat-success"],
        });
      })
    }
    else {
      // Display an error message if the form is invalid
      this._snackBar.open("Please fill in all required fields", '', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['mat-toolbar', 'mat-warn'],
      });
    }
  }






  //CKeditor

  config: any = {
    toolbar: [
      { name: 'document', items: ['Source', '-', 'NewPage', 'Preview', '-', 'Templates'] },
      { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
      { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll'] },
      '/',
      { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
      { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'] },
      { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
      { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
      '/',
      { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
      { name: 'colors', items: ['TextColor', 'BGColor'] },
      { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
      { name: 'others', items: ['-'] },
    ],
    width: '100%',
    removePlugins: 'elementspath',
  };
}
