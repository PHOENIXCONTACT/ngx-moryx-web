import { Component, OnInit } from '@angular/core';
import { Entry, EntryUnitType, EntryValueType } from '@moryx/ngx-web-framework/entry-editor';

@Component({
  selector: 'app-entry-editor-demo',
  templateUrl: './entry-editor-demo.component.html',
  styleUrls: ['./entry-editor-demo.component.scss'],
})
export class EntryEditorDemoComponent implements OnInit {
  disabled = false;
  entry: Entry = {
    displayName: 'Test Entry',
    description: 'This is the description of a test entry',
    identifier: 'RootEntry',
    subEntries: [
      {
        // String
        displayName: 'Test String Name',
        description: 'This is a Test String description.',
        identifier: 'String Identifier',
        validation: {
          isRequired: true,
          regex: '[A-Za-z]+',
        },
        value: {
          current: 'Current Value of the Test String',
          default: 'Default Value of the Test String',
          isReadOnly: false,
          possible: undefined,
          type: EntryValueType.String,
          unitType: EntryUnitType.None,
        },
      },
      {
        // String
        displayName: 'Test String Name',
        description: 'This is a Test String description.',
        identifier: 'Default String Identifier',
        validation: {
          isRequired: true,
          regex: '[A-Za-z]+',
        },
        value: {
          current: undefined,
          default: 'Default Value of the Test String',
          isReadOnly: false,
          possible: undefined,
          type: EntryValueType.String,
          unitType: EntryUnitType.None,
        },
      },
      {
        // String
        displayName: 'Test Disabled String Name',
        description: 'This is a Test String description.',
        identifier: 'Disabled String Identifier',
        validation: {
          isRequired: true,
          regex: '[A-Za-z]+',
        },
        value: {
          current: 'Current Value of the Disabled Test String',
          default: 'Default Value of the Test String',
          isReadOnly: true,
          possible: undefined,
          type: EntryValueType.String,
          unitType: EntryUnitType.None,
        },
      },
      {
        // Number
        displayName: 'Test Number Name',
        description: 'This is a Test Number description.',
        identifier: 'Number Identifier',
        validation: { maximum: 43, minimum: 41 },
        value: {
          current: undefined,
          default: undefined,
          isReadOnly: false,
          possible: undefined,
          type: EntryValueType.Int32,
          unitType: EntryUnitType.None,
        },
      },
      {
        // Double
        displayName: 'Test Double Name',
        description: 'This is a Test Double description.',
        identifier: 'Double Identifier',
        validation: { maximum: 40.55, minimum: 0.0},
        value: {
          current: undefined,
          default: undefined,
          isReadOnly: false,
          possible: undefined,
          type: EntryValueType.Double,
          unitType: EntryUnitType.None,
        },
      },
      {
        // Single
        displayName: 'Type Single number Name',
        description: 'This is a Test Single description.',
        identifier: 'Single Identifier',
        value: {
          current: undefined,
          default: undefined,
          isReadOnly: false,
          possible: undefined,
          type: EntryValueType.Single,
          unitType: EntryUnitType.None,
        },
      },
      {
        // Bool
        displayName: 'Test Bool Name',
        description: 'This is a Test Bool description.',
        identifier: 'Bool Identifier',
        value: {
          current: 'True',
          default: undefined,
          isReadOnly: false,
          possible: undefined,
          type: EntryValueType.Boolean,
          unitType: EntryUnitType.None,
        },
      },
      {
        // Bool
        displayName: 'Test Default Bool Name',
        description: 'This is a Default Test Bool description.',
        identifier: 'Default Bool Identifier',
        value: {
          current: undefined,
          default: 'True',
          isReadOnly: false,
          possible: undefined,
          type: EntryValueType.Boolean,
          unitType: EntryUnitType.None,
        },
      },
      {
        // Bool
        displayName: 'Test Disabled Bool Name',
        description: 'This is a Disabled Test Bool description.',
        identifier: 'Disabled Bool Identifier',
        value: {
          current: undefined,
          default: undefined,
          isReadOnly: true,
          possible: undefined,
          type: EntryValueType.Boolean,
          unitType: EntryUnitType.None,
        },
      },
      { // Select
        displayName: "Test Select Name",
        description: "This is a Test Select description.",
        identifier: "Select Identifier",
        value: {
          current: "Option 1",
          default: undefined,
          isReadOnly: false,
          possible: ["Option 1", "Option 2", "Option 3"],
          type: EntryValueType.Enum,
          unitType: EntryUnitType.None
        }
      },
      { // Select
        displayName: "Test Default Select Name",
        description: "This is a Test Default Select description.",
        identifier: "Default Select Identifier",
        value: {
          current: undefined,
          default: "Option 2",
          isReadOnly: false,
          possible: ["Option 1", "Option 2", "Option 3"],
          type: EntryValueType.Enum,
          unitType: EntryUnitType.None
        }
      },
      {
        // Select
        displayName: 'String With Possible values',
        description: 'String With Possible values description.',
        identifier: 'String With Possible values Identifier',
        value: {
          current: undefined,
          default: 'Possible 2',
          isReadOnly: false,
          possible: ['Possible 1', 'Possible 2', 'Possible 3'],
          type: EntryValueType.String,
          unitType: EntryUnitType.None,
        },
      },
      {
        // Select
        displayName: 'Double With Possible values',
        description: 'Double With Possible values description.',
        identifier: 'Double With Possible values Identifier',
        value: {
          current: '0',
          default: '0.5',
          isReadOnly: false,
          possible: ['0.5', '2.5', '10.5'],
          type: EntryValueType.Double,
          unitType: EntryUnitType.None,
        },
      },
      {
        // Select
        displayName: 'Int32 With Possible values',
        description: 'Int32 With Possible values description.',
        identifier: 'Int32 With Possible values Identifier',
        value: {
          current: '0',
          default: '10',
          isReadOnly: false,
          possible: ['10', '15', '20'],
          type: EntryValueType.Int32,
          unitType: EntryUnitType.None,
        },
      },
      {
        // Select
        displayName: 'Test Disabled Select Name',
        description: 'This is a Disabled Test Select description.',
        identifier: 'Disabled Select Identifier',
        value: {
          current: undefined,
          default: undefined,
          isReadOnly: true,
          possible: ['Option 1', 'Option 2', 'Option 3'],
          type: EntryValueType.Enum,
          unitType: EntryUnitType.None,
        },
      },
      {
        // File
        displayName: 'Test File Name',
        description: 'This is a Test File description.',
        identifier: 'File Identifier',
        value: {
          current: undefined,
          default: undefined,
          isReadOnly: false,
          possible: undefined,
          type: EntryValueType.Stream,
          unitType: EntryUnitType.File,
        },
      },
      {
        // File
        displayName: 'Disabled Test File Name',
        description: 'This is a Disabled Test File description.',
        identifier: 'Disabled File Identifier',
        value: {
          current: undefined,
          default: undefined,
          isReadOnly: true,
          possible: undefined,
          type: EntryValueType.Stream,
          unitType: EntryUnitType.File,
        },
      },
      {
        // Object
        displayName: 'Subentry Object Name',
        description: 'This is a Subentry Object description.',
        identifier: 'SubentryObjectIdentifier',
        value: {
          current: undefined,
          default: undefined,
          isReadOnly: true,
          possible: undefined,
          type: EntryValueType.Class,
          unitType: EntryUnitType.None,
        },
      },
      {
        // Collection
        displayName: 'Test Collection Name',
        description: 'This is a Test Collection description.',
        identifier: 'CollectionIdentifier',
        value: {
          possible: [EntryValueType.Boolean],
          type: EntryValueType.Collection,
        },
        prototypes: [
          {
            displayName: `${EntryValueType.Boolean}`,
            identifier: 'BooleanPrototype',
            description: 'Boolean Prototype Ddescription',
            value: { default: 'True', type: EntryValueType.Boolean },
          },
        ],
        subEntries: [
          {
            displayName: 'Test List Entry',
            description: 'Test List Description',
            identifier: 'List Entry 1',
            value: {
              current: '',
              default: '',
              type: EntryValueType.String,
            },
          },
          {
            // Object
            displayName: 'Subentry Object Name',
            description: 'This is a Subentry Object description.',
            identifier: 'SubentryObjectIdentifier',
            value: {
              current: undefined,
              default: undefined,
              isReadOnly: true,
              possible: undefined,
              type: EntryValueType.Class,
              unitType: EntryUnitType.None,
            },
          }
        ],
      },
    ],
    value: {},
  };

  ngOnInit(): void {}

  onToggle() {
    this.disabled = !this.disabled;
  }
}
