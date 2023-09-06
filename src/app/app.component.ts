import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';
import { QueryBuilderClassNames, QueryBuilderConfig, RuleSet } from './query-builder/query-builder.interfaces';
import { QueryBuilderComponent } from './query-builder/query-builder.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public queryCtrl: FormControl;
  public queryForm: FormGroup;

  public bootstrapClassNames: QueryBuilderClassNames = {
    removeIcon: 'fa fa-minus',
    addIcon: 'fa fa-plus',
    arrowIcon: 'fa fa-chevron-right px-2',
    button: 'btn',
    buttonGroup: 'btn-group ml-2',
    rightAlign: '',
    switchRow: 'd-flex px-2',
    switchGroup: 'd-flex align-items-center',
    ruleSetswitchRow: 'd-flex px-0',
    row: 'row align-items-center',
    rule: 'border py-2 px-0 ',
    ruleSet: 'border-0 py-2 px-0',
    invalidRuleSet: '',
    emptyWarning: 'text-danger mx-auto',
    operatorControl: 'form-control form-control-sm',
    operatorControlSize: 'col-auto pr-0',
    fieldControl: 'form-control form-control-sm',
    fieldControlSize: 'col-auto pr-0',
    entityControl: 'form-control form-control-sm',
    entityControlSize: 'col-auto pr-0',
    inputControl: 'form-control form-control-sm',
    inputControlSize: 'col-auto'
  };

  public query: RuleSet = {
    "condition": "and",
    "rules": [
      {
        "field": "name",
        "operator": "=",
        "entity": "physical"
      },
      {
        "field": "age",
        "operator": "=",
        "entity": "nonphysical",
        "value": 0
      },
      {
        "condition": "or",
        "rules": [
          {
            "field": "gender",
            "operator": "=",
            "entity": "physical"
          },
          {
            "field": "school",
            "operator": "is null",
            "entity": "nonphysical"
          },
          {
            "condition": "and",
            "rules": [
              {
                "field": "educated",
                "operator": "=",
                "value": true
              },
              {
                "field": "age",
                "operator": "="
              }
            ]
          }
        ]
      },
      {
        "field": "notes",
        "operator": "=",
        "value": "asd"
      }
    ]
  }

  public entityConfig: QueryBuilderConfig = {
    entities: {
      physical: { name: 'Physical Attributes' },
      nonphysical: { name: 'Nonphysical Attributes' }
    },
    fields: {
      age: { name: 'Age', type: 'number', entity: 'physical' },
      gender: {
        name: 'Gender',
        entity: 'physical',
        type: 'category',
        options: [
          { name: 'Male', value: 'm' },
          { name: 'Female', value: 'f' }
        ]
      },
      name: { name: 'Name', type: 'string', entity: 'nonphysical' },
      notes: { name: 'Notes', type: 'textarea', operators: ['=', '!='], entity: 'nonphysical' },
      educated: { name: 'College Degree?', type: 'boolean', entity: 'nonphysical' },
      birthday: {
        name: 'Birthday', type: 'date', operators: ['=', '<=', '>'],
        defaultValue: (() => new Date()), entity: 'nonphysical'
      },
      school: { name: 'School', type: 'string', nullable: true, entity: 'nonphysical' },
      occupation: {
        name: 'Occupation',
        entity: 'nonphysical',
        type: 'category',
        options: [
          { name: 'Student', value: 'student' },
          { name: 'Teacher', value: 'teacher' },
          { name: 'Unemployed', value: 'unemployed' },
          { name: 'Scientist', value: 'scientist' }
        ]
      }
    }
  };

  public config: QueryBuilderConfig = {
    fields: {
      age: {
        name: 'Age',
        type: 'number',
        validator: (rule) => {
          const isNumber = /^[0-9]*$/.test(rule.value);
          if (!isNumber) {
            rule.validationMessage = 'Age must be a number!';
            return 'Age must be a number!';
          } else {
            const age = +rule.value;
            if (age < 1) {
              rule.validationMessage = 'Age must be > 1';
              return 'Age must be > 1';
            } else if (age > 100) {
              rule.validationMessage = 'Age must be < 100';
              return 'Age must be < 100';
            }
          }
          return null;
        }
      },
      gender: {
        name: 'Gender',
        type: 'category',
        options: [
          { name: 'Male', value: 'm' },
          { name: 'Female', value: 'f' }
        ]
      },
      name: { name: 'Name', type: 'string' },
      notes: { name: 'Notes', type: 'textarea', operators: ['=', '!='] },
      educated: { name: 'College Degree?', type: 'boolean' },
      birthday: {
        name: 'Birthday', type: 'date', operators: ['=', '<=', '>'],
        defaultValue: (() => new Date())
      },
      school: { name: 'School', type: 'string', nullable: true },
      occupation: {
        name: 'Occupation',
        type: 'category',
        options: [
          { name: 'Student', value: 'student' },
          { name: 'Teacher', value: 'teacher' },
          { name: 'Unemployed', value: 'unemployed' },
          { name: 'Scientist', value: 'scientist' }
        ]
      }
    }
  };

  public currentConfig: QueryBuilderConfig;
  public allowRuleset: boolean = true;
  public allowCollapse: boolean = false;
  public persistValueOnFieldChange: boolean = false;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.queryForm = this.formBuilder.group({
      'queryField': [this.query]
    });
    this.queryCtrl = this.formBuilder.control(this.query);
    this.currentConfig = this.config;
  }

  valueToSQL(value) {
    switch (typeof value) {
      case 'string':
        return "'" + value + "'";
      case 'boolean':
        return value ? '1' : '0';
      case 'number':
        if (isFinite(value)) return value;
    }
  }

  isDefined(value) {
    return value !== undefined;
  }

  basicRulesetToSQL(ruleset) {
    return ruleset.rules.map((rule) => {
      if (rule.rules) {
        return "(" + this.basicRulesetToSQL(rule) + ")";
      }
      var column = rule.field,
        operator, value;

      switch (rule.operator) {
        case "is null":
        case "is not null":
          operator = rule.operator;
          value = "";
          break;
        case "in":
        case "not in":
          operator = rule.operator;
          if (Array.isArray(rule.value) && rule.value.length)
            value = "(" + rule.value.map(this.valueToSQL).filter(this.isDefined).join(", ") + ")";
          break;
        default:
          operator = rule.operator;
          value = this.valueToSQL(rule.value);
          break;
      }

      if (this.isDefined(column) && this.isDefined(operator)) {
        return "(" + (column + " " + operator + " " + value).trim() + ")";
      }
    }).filter(this.isDefined).join(" " + ruleset.condition + " ");
  }

  switchModes(event: Event) {
    this.currentConfig = (<HTMLInputElement>event.target).checked ? this.entityConfig : this.config;
  }

  changeDisabled(event: Event) {
    (<HTMLInputElement>event.target).checked ? this.queryCtrl.disable() : this.queryCtrl.enable();
  }

  vanilla() {
    console.log(this.queryCtrl.value)
    console.log(this.basicRulesetToSQL(this.queryCtrl.value))
  }

  @ViewChild('queryBuilder') queryBuilder: QueryBuilderComponent;

  vanillaReactive() {
    console.log(this.queryForm.valid, this.queryForm.get('queryField'))
    this.queryBuilder.submit();
    // this.queryForm.get('queryField').updateValueAndValidity();
    console.log(this.queryForm.get('queryField').value)
    console.log(this.basicRulesetToSQL(this.queryForm.get('queryField').value))
  }

  bs() {
    console.log(this.query)
    console.log(this.basicRulesetToSQL(this.query))
  }
}
