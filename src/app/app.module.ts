import { NgModule } from '@angular/core';

import { QueryBuilderComponent } from './query-builder/query-builder.component';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppComponent } from './app.component';
import { QueryArrowIconDirective } from './query-builder/query-arrow-icon.directive';
import { QueryButtonGroupDirective } from './query-builder/query-button-group.directive';
import { QueryEmptyWarningDirective } from './query-builder/query-empty-warning.directive';
import { QueryEntityDirective } from './query-builder/query-entity.directive';
import { QueryFieldDirective } from './query-builder/query-field.directive';
import { QueryInputDirective } from './query-builder/query-input.directive';
import { QueryOperatorDirective } from './query-builder/query-operator.directive';
import { QueryRemoveButtonDirective } from './query-builder/query-remove-button.directive';
import { QuerySwitchGroupDirective } from './query-builder/query-switch-group.directive';
import { MultiSelectSearchFilter, MultiselectDropdownComponent } from './multiselect-dropdown/multiselect-dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    QueryBuilderComponent,
    QueryInputDirective,
    QueryOperatorDirective,
    QueryFieldDirective,
    QueryEntityDirective,
    QueryButtonGroupDirective,
    QuerySwitchGroupDirective,
    QueryRemoveButtonDirective,
    QueryEmptyWarningDirective,
    QueryArrowIconDirective,
    MultiselectDropdownComponent,
    MultiSelectSearchFilter
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot()
  ],
  exports: [
    QueryBuilderComponent,
    QueryInputDirective,
    QueryOperatorDirective,
    QueryFieldDirective,
    QueryEntityDirective,
    QueryButtonGroupDirective,
    QuerySwitchGroupDirective,
    QueryRemoveButtonDirective,
    QueryEmptyWarningDirective,
    QueryArrowIconDirective,
    MultiselectDropdownComponent,
    MultiSelectSearchFilter
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }