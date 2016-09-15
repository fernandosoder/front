import { Component, EventEmitter } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, FormBuilder, Validators, RadioButtonState } from '@angular/common';
import { Router, RouteParams } from '@angular/router-deprecated';

import { Client } from '../../../services/api';

@Component({
  selector: 'minds-onboarding-categories-selector',
  outputs: [ 'done' ],
  templateUrl: 'src/components/onboarding/categories-selector/categories-selector.html',
  directives: [ FORM_DIRECTIVES ]
})

export class OnboardingCategoriesSelector {

  categories : Array<any> = [];
  channels : Array<any> = [];

  inProgress : boolean = false;
  done : EventEmitter<any> = new EventEmitter();

	constructor(public client : Client){

	}

  ngOnInit(){
    this.initCategories();
  }

  initCategories(){
    this.categories = Object.keys(window.Minds.categories).map(function(key) {
        return {
          id: key,
          label: window.Minds.categories[key],
          selected: false
        };
    });
  }

  findChannels(){
    this.inProgress = true;
    this.client.get('api/v1/categories/featured', {
        categories: this.categories
          .filter((category) => {
            return category.selected;
          })
          .map((category) => {
            return category.id;
          })
      })
      .then((response : any) => {
        this.inProgress = false;
        this.channels = response.entities.map((channel) => {
          channel.selected = true;
          return channel;
        });
      })
      .catch(() => {
        this.inProgress = false;
      })
  }

}
