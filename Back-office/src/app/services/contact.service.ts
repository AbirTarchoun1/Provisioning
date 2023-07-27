import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact } from '../models/entity/contact';
import { ApiconfigService } from './apiconfig.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private base_url!: string;

  constructor(private http: HttpClient, private apiconfigService: ApiconfigService) {
   
  }

/**
 * 
 * @returns Observable of all contacts
 */
getAllContacts(): Observable<Contact[]> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => this.http.get<Contact[]>(`${apiBaseUrl}/api/Contact`))
  );
}

/**
 * 
 * @param id Contact ID
 * @returns Observable of the contact
 */
getContactById(id: number): Observable<Contact> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => this.http.get<Contact>(`${apiBaseUrl}/${id}`))
  );
}

/**
 * 
 * @param contact Contact data
 * @returns Observable of the created contact
 */
createContact(contact: Contact): Observable<Contact> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => this.http.post<Contact>(apiBaseUrl, contact))
  );
}

/**
 * 
 * @param contact Contact data
 * @returns Observable of the updated contact
 */
updateContact(contact: Contact): Observable<Contact> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => this.http.put<Contact>(`${apiBaseUrl}/${contact.contactId}`, contact))
  );
}

/**
 * 
 * @param id Contact ID
 * @returns Observable indicating the success of the deletion
 */
deleteContact(id: number): Observable<void> {
  return this.apiconfigService.getApiBasePath().pipe(
    switchMap(apiBaseUrl => this.http.delete<void>(`${apiBaseUrl}/${id}`))
  );
}

// Validation form
form: FormGroup = new FormGroup({
  object: new FormControl('', [Validators.required]),
  text: new FormControl('', [Validators.required]),
  email: new FormControl('', [Validators.required, Validators.email]),
  companyName: new FormControl('', [Validators.required]),
});

// Initialization form
initializeFormGroup() {
  this.form.setValue({
    object: '',
    email: '',
    text: '',
    companyName: ''
  });
}
}