import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  steps:Step[] = [
    {step: 1, label: 'First Name', type: 'Input'},
    {step: 2, label: 'Last Name', type: 'Input'},
    {step: 3, label: 'Country', type: 'Options'},
    {step: 4, label: 'City', type: 'Options'},
    {step: 5, label: 'Phone Number', type: 'Input'},
    {step: 6, label: 'Email', type: 'Email'},
  ];
  Options3 = ['Argentina', 'Mexico'];
  Options4 = [['Buenos Aires', 'Rosario'], ['Ciudad de Mexico', 'Juarez']];
  Options5 = ['+54 ', '+52 '];
 
  formValues: { [key: string]: string } = {};
  errorMessage: string = "";
  successMessage: string = "";

  handleSelectChange(step:Step) 
  { 
    console.log("handleOptionChange", step, this.formValues); 
    this.errorMessage = "";
    if(step.label == "Country"){
      this.formValues[this.getFormValueIndexByName("Phone Number")] = this.Options5[this.Options3.indexOf(this.formValues[this.getFormValueIndexByName("Country")])];
    } 
    if(step.type == "Email")
    {
      var regexpattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
      var valid = regexpattern.test(this.formValues[this.getFormValueIndexByName('Email')]);
      if(!valid)
        this.errorMessage = "Email not Valid.";
      else
        this.errorMessage = "";
    }
    
  };

  getFormValueIndexByName(name: string){
    return this.steps.findIndex(i => i.label == name) + 1;
  }

  emptyValue(name: string){
    this.formValues[this.steps.findIndex(i => i.label == name) + 1] = "";
  }

  async handleSubmit(form: any) 
  { 
    console.log("handleSubmit", form.invalid, this.formValues[this.getFormValueIndexByName("Phone Number")].length); 
    if(form.invalid || this.formValues[this.getFormValueIndexByName("Phone Number")].length <= 4){
      this.errorMessage = "Check again, there's something wrong. Please be sure you filled all fields."
      return;
    }

    if(!form.invalid){
      try {
        const payload = {
          "userInfo": {
          "name": this.formValues[this.getFormValueIndexByName("First Name")],
          "lastName": this.formValues[this.getFormValueIndexByName("Last Name")],
          "country": this.formValues[this.getFormValueIndexByName("Country")],
          "city": this.formValues[this.getFormValueIndexByName("City")],
          "phoneNumber": this.formValues[this.getFormValueIndexByName("Phone Number")],
          "email": this.formValues[this.getFormValueIndexByName("Email")],
          }
        };

        console.log("Payload", payload);
        const response = await fetch('http://localhost:3000/SaveUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          this.errorMessage = "There's something wrong trying to create the user. Please try again."
        }

        await response.json();
        this.successMessage = "User created successfully."
      } catch (error) {
          this.errorMessage = "There's something wrong trying to create the user. Please contact us."
      }
    }
  };

}
interface Step {
  step: number;
  label: string;
  type: string;
}