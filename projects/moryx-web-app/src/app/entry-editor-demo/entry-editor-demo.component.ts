import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { Entry, EntryUnitType, EntryValueType, NavigableEntryEditorComponent } from '@moryx/ngx-web-framework/entry-editor';

@Component({
    selector: 'app-entry-editor-demo',
    templateUrl: './entry-editor-demo.component.html',
    styleUrls: ['./entry-editor-demo.component.scss'],
    standalone: true,
    imports: [CommonModule, NavigableEntryEditorComponent, MatDivider, MatButtonModule]
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
        // Number
        displayName: 'Type Single Number Name',
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
        // Double
        displayName: 'Test Double Number Name',
        description: 'This is a Test Double description.',
        identifier: 'Double Identifier',
        validation: { maximum: 41.5, minimum: -41.5 },
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
        displayName: 'Test Bool Name (without description)',
        description: undefined,
        identifier: 'Bool Identifier without Description',
        value: {
          current: undefined,
          default: undefined,
          isReadOnly: false,
          possible: undefined,
          type: EntryValueType.Boolean,
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
          default: 'true',
          isReadOnly: false,
          possible: undefined,
          type: EntryValueType.Boolean,
          unitType: EntryUnitType.None,
        },
      },
      {
        // Bool
        displayName: 'Test Disabled Bool Name',
        description: 'This is a very very very long Disabled Test Bool description.',
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
      {
        // Select
        displayName: 'Possible String Select ',
        description: 'description.',
        identifier: 'Select Identifier',
        value: {
          current: 'Option 1',
          default: undefined,
          isReadOnly: false,
          possible: ['Option 1'],
          type: EntryValueType.String,
          unitType: EntryUnitType.None,
        },
      },
      {
        // Select
        displayName: 'Test Default Select Name',
        description: 'This is a Test Default Select description.',
        identifier: 'Default Select Identifier',
        value: {
          current: undefined,
          default: 'Option 2',
          isReadOnly: false,
          possible: ['Option 1', 'Option 2', 'Option 3'],
          type: EntryValueType.Enum,
          unitType: EntryUnitType.None,
        },
      },      
      {
        // Select
        displayName: 'String AND Possible values',
        description: 'String AND Possible values description.',
        identifier: 'String AND Possible values Identifier',
        value: {
          current: undefined,
          default: undefined,
          isReadOnly: false,
          possible: ['Possible 1', 'Possible 2', 'Possible 3'],
          type: EntryValueType.String,
          unitType: EntryUnitType.None,
        },
      },
      {
        // Select
        displayName: 'String & Possible values and default',
        description: 'String & Possible values description.',
        identifier: 'String & Possible values Identifier',
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
        // Flag Enum
        displayName: 'Test Disabled Flag Enum Name',
        description: 'This is a Disabled Test Flag Enum description.',
        identifier: 'Disabled Flag Enum Identifier',
        value: {
          current: '0',
          default: '',
          isReadOnly: false,
          possible: ['Option 1', 'Option 2', 'Option 3'],
          type: EntryValueType.Enum,
          unitType: EntryUnitType.Flags,
        },
      },
      {
        // Flag Enum
        displayName: 'Test Disabled Flag Enum Name',
        description: 'This is a Disabled Test Flag Enum description.',
        identifier: 'Disabled Flag Enum Identifier',
        value: {
          current: 'Option 1, Option 3',
          default: '',
          isReadOnly: false,
          possible: ['Option 1', 'Option 2', 'Option 3'],
          type: EntryValueType.Enum,
          unitType: EntryUnitType.Flags,
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
            identifier: 'SubSubentryObjectIdentifier',
            value: {
              current: undefined,
              default: undefined,
              isReadOnly: true,
              possible: undefined,
              type: EntryValueType.Class,
              unitType: EntryUnitType.None,
            },
          },
        ],
      },
      {
        // Collection
        displayName: 'Test Collection Name',
        description: 'This is a Test Collection description.',
        identifier: 'CollectionIdentifier',
        value: {
          default: EntryValueType.Boolean,
          possible: [EntryValueType.Boolean, EntryValueType.Int64],
          type: EntryValueType.Collection,
        },
        prototypes: [
          {
            displayName: `${EntryValueType.Boolean}`,
            identifier: 'BooleanPrototype',
            description: 'Boolean Prototype Description',
            value: { default: 'True', type: EntryValueType.Boolean },
          },
          {
            displayName: `${EntryValueType.Int64}`,
            identifier: 'Int64Prototype',
            description: 'Int64 Prototype Ddescription',
            value: { default: '42', type: EntryValueType.Int64 },
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
          },
        ],
      },
      {
        displayName: 'Localized Class',
        identifier: 'LocalizedClass',
        description: null,
        value: {
          type: EntryValueType.Class,
          unitType: EntryUnitType.None,
          current: 'LocalizedClass',
          default: 'LocalizedClass',
          possible: null,
          isReadOnly: false,
        },
        validation: {
          minimum: -1.7976931348623157e308,
          maximum: 1.7976931348623157e308,
          regex: null,
          isRequired: false,
        },
        subEntries: [
          {
            displayName: 'Ein Schtring',
            identifier: 'PropDisplayAttribute',
            description: 'Eigenschaftsbeschreibung',
            value: {
              type: EntryValueType.String,
              unitType: EntryUnitType.None,
              current: null,
              default: null,
              possible: null,
              isReadOnly: false,
            },
            validation: {
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
              regex: null,
              isRequired: false,
            },
            subEntries: [],
            prototypes: [],
          },
          {
            displayName: 'Display Name',
            identifier: 'PropDisplayNameAttribute',
            description: null,
            value: {
              type: EntryValueType.String,
              unitType: EntryUnitType.None,
              current: null,
              default: null,
              possible: null,
              isReadOnly: false,
            },
            validation: {
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
              regex: null,
              isRequired: false,
            },
            subEntries: [],
            prototypes: [],
          },
          {
            displayName: 'PropSubClasses',
            identifier: 'PropSubClasses',
            description: null,
            value: {
              type: EntryValueType.Collection,
              unitType: EntryUnitType.None,
              current: 'LocalizedSubClass',
              default: 'LocalizedSubClass',
              possible: ['LocalizedSubClass'],
              isReadOnly: false,
            },
            validation: {
              minimum: -1.7976931348623157e308,
              maximum: 1.7976931348623157e308,
              regex: null,
              isRequired: false,
            },
            subEntries: [],
            prototypes: [
              {
                displayName: 'Fame Document',
                identifier: 'LocalizedSubClass',
                description: null,
                value: {
                  type: EntryValueType.Class,
                  unitType: EntryUnitType.None,
                  current: 'LocalizedSubClass',
                  default: 'LocalizedSubClass',
                  possible: null,
                  isReadOnly: false,
                },
                validation: {
                  minimum: -1.7976931348623157e308,
                  maximum: 1.7976931348623157e308,
                  regex: null,
                  isRequired: false,
                },
                subEntries: [
                  {
                    displayName: 'MyProperty',
                    identifier: 'MyProperty',
                    description: null,
                    value: {
                      type: EntryValueType.Int32,
                      unitType: EntryUnitType.None,
                      current: '0',
                      default: '0',
                      possible: null,
                      isReadOnly: false,
                    },
                    validation: {
                      minimum: -1.7976931348623157e308,
                      maximum: 1.7976931348623157e308,
                      regex: null,
                      isRequired: false,
                    },
                    subEntries: [],
                    prototypes: [],
                  },
                ],
                prototypes: [],
              },
            ],
          },
        ],
        prototypes: [],
      },
    ],
    value: {},
  };

  entry2: Entry = {
      "displayName": "TcpDriverSample",
      "identifier": "TcpDriverSample",
      "description": null,
      "value": {
        "type": EntryValueType.Class,
        "unitType": EntryUnitType.None,
        "current": "TcpDriverSample",
        "default": "TcpDriverSample",
        "possible": null,
        "isReadOnly": false
      },
      "validation": {
        "minimum": -1.7976931348623157e+308,
        "maximum": 1.7976931348623157e+308,
        "regex": null,
        "isRequired": false
      },
      "subEntries": [
        {
          "displayName": "TcpConfig",
          "identifier": "TcpConfig",
          "description": null,
          "value": {
            "type": EntryValueType.Class,
            "unitType": EntryUnitType.None,
            "current": "TcpClientConfig",
            "default": "BinaryConnectionConfig",
            "possible": [
              "BinaryConnectionConfig",
              "TcpClientConfig",
              "TcpListenerConfig"
            ],
            "isReadOnly": false
          },
          "validation": {
            "minimum": -1.7976931348623157e+308,
            "maximum": 1.7976931348623157e+308,
            "regex": null,
            "isRequired": false
          },
          "subEntries": [
            {
              "displayName": "PluginName",
              "identifier": "PluginName",
              "description": null,
              "value": {
                "type": EntryValueType.String,
                "unitType": EntryUnitType.None,
                "current": "TcpClientConnection",
                "default": null,
                "possible": null,
                "isReadOnly": true
              },
              "validation": {
                "minimum": -1.7976931348623157e+308,
                "maximum": 1.7976931348623157e+308,
                "regex": null,
                "isRequired": false
              },
              "subEntries": [],
              "prototypes": []
            },
            {
              "displayName": "IpAdress",
              "identifier": "IpAdress",
              "description": "The IPAdress for this device",
              "value": {
                "type": EntryValueType.String,
                "unitType": EntryUnitType.None,
                "current": null,
                "default": null,
                "possible": null,
                "isReadOnly": false
              },
              "validation": {
                "minimum": -1.7976931348623157e+308,
                "maximum": 1.7976931348623157e+308,
                "regex": null,
                "isRequired": false
              },
              "subEntries": [],
              "prototypes": []
            },
            {
              "displayName": "Port",
              "identifier": "Port",
              "description": "The TCP-Port for this Device",
              "value": {
                "type": EntryValueType.Int32,
                "unitType": EntryUnitType.None,
                "current": "0",
                "default": "5002",
                "possible": null,
                "isReadOnly": false
              },
              "validation": {
                "minimum": -1.7976931348623157e+308,
                "maximum": 1.7976931348623157e+308,
                "regex": null,
                "isRequired": false
              },
              "subEntries": [],
              "prototypes": []
            },
            {
              "displayName": "RetryWaitMs",
              "identifier": "RetryWaitMs",
              "description": "Time to wait between attempts to open a connection in ms.",
              "value": {
                "type": EntryValueType.Int32,
                "unitType": EntryUnitType.None,
                "current": "0",
                "default": "500",
                "possible": null,
                "isReadOnly": false
              },
              "validation": {
                "minimum": -1.7976931348623157e+308,
                "maximum": 1.7976931348623157e+308,
                "regex": null,
                "isRequired": false
              },
              "subEntries": [],
              "prototypes": []
            },
            {
              "displayName": "MonitoringIntervalMs",
              "identifier": "MonitoringIntervalMs",
              "description": "Time in milliseconds to check if connection is still open. Disable with -1",
              "value": {
                "type": EntryValueType.Int32,
                "unitType": EntryUnitType.None,
                "current": "0",
                "default": "5000",
                "possible": null,
                "isReadOnly": false
              },
              "validation": {
                "minimum": -1.7976931348623157e+308,
                "maximum": 1.7976931348623157e+308,
                "regex": null,
                "isRequired": false
              },
              "subEntries": [],
              "prototypes": []
            },
            {
              "displayName": "MonitoringTimeoutMs",
              "identifier": "MonitoringTimeoutMs",
              "description": "Timeout for a monitoring call",
              "value": {
                "type": EntryValueType.Int32,
                "unitType": EntryUnitType.None,
                "current": "0",
                "default": "500",
                "possible": null,
                "isReadOnly": false
              },
              "validation": {
                "minimum": -1.7976931348623157e+308,
                "maximum": 1.7976931348623157e+308,
                "regex": null,
                "isRequired": false
              },
              "subEntries": [],
              "prototypes": []
            }
          ],
          "prototypes": [
            {
              "displayName": "BinaryConnectionConfig",
              "identifier": "BinaryConnectionConfig",
              "description": null,
              "value": {
                "type": EntryValueType.Class,
                "unitType": EntryUnitType.None,
                "current": "BinaryConnectionConfig",
                "default": "BinaryConnectionConfig",
                "possible": [
                  "BinaryConnectionConfig",
                  "TcpClientConfig",
                  "TcpListenerConfig"
                ],
                "isReadOnly": false
              },
              "validation": {
                "minimum": -1.7976931348623157e+308,
                "maximum": 1.7976931348623157e+308,
                "regex": null,
                "isRequired": false
              },
              "subEntries": [
                {
                  "displayName": "PluginName",
                  "identifier": "PluginName",
                  "description": null,
                  "value": {
                    "type": EntryValueType.String,
                    "unitType": EntryUnitType.None,
                    "current": "CommunicatorConfig",
                    "default": null,
                    "possible": null,
                    "isReadOnly": true
                  },
                  "validation": {
                    "minimum": -1.7976931348623157e+308,
                    "maximum": 1.7976931348623157e+308,
                    "regex": null,
                    "isRequired": false
                  },
                  "subEntries": [],
                  "prototypes": []
                }
              ],
              "prototypes": []
            },
            {
              "displayName": "TcpClientConfig",
              "identifier": "TcpClientConfig",
              "description": null,
              "value": {
                "type": EntryValueType.Class,
                "unitType": EntryUnitType.None,
                "current": "TcpClientConfig",
                "default": "TcpClientConfig",
                "possible": [
                  "BinaryConnectionConfig",
                  "TcpClientConfig",
                  "TcpListenerConfig"
                ],
                "isReadOnly": false
              },
              "validation": {
                "minimum": -1.7976931348623157e+308,
                "maximum": 1.7976931348623157e+308,
                "regex": null,
                "isRequired": false
              },
              "subEntries": [
                {
                  "displayName": "PluginName",
                  "identifier": "PluginName",
                  "description": null,
                  "value": {
                    "type": EntryValueType.String,
                    "unitType": EntryUnitType.None,
                    "current": "TcpClientConnection",
                    "default": null,
                    "possible": null,
                    "isReadOnly": true
                  },
                  "validation": {
                    "minimum": -1.7976931348623157e+308,
                    "maximum": 1.7976931348623157e+308,
                    "regex": null,
                    "isRequired": false
                  },
                  "subEntries": [],
                  "prototypes": []
                },
                {
                  "displayName": "IpAdress",
                  "identifier": "IpAdress",
                  "description": "The IPAdress for this device",
                  "value": {
                    "type": EntryValueType.String,
                    "unitType": EntryUnitType.None,
                    "current": null,
                    "default": null,
                    "possible": null,
                    "isReadOnly": false
                  },
                  "validation": {
                    "minimum": -1.7976931348623157e+308,
                    "maximum": 1.7976931348623157e+308,
                    "regex": null,
                    "isRequired": false
                  },
                  "subEntries": [],
                  "prototypes": []
                },
                {
                  "displayName": "Port",
                  "identifier": "Port",
                  "description": "The TCP-Port for this Device",
                  "value": {
                    "type": EntryValueType.Int32,
                    "unitType": EntryUnitType.None,
                    "current": "0",
                    "default": "5002",
                    "possible": null,
                    "isReadOnly": false
                  },
                  "validation": {
                    "minimum": -1.7976931348623157e+308,
                    "maximum": 1.7976931348623157e+308,
                    "regex": null,
                    "isRequired": false
                  },
                  "subEntries": [],
                  "prototypes": []
                },
                {
                  "displayName": "RetryWaitMs",
                  "identifier": "RetryWaitMs",
                  "description": "Time to wait between attempts to open a connection in ms.",
                  "value": {
                    "type": EntryValueType.Int32,
                    "unitType": EntryUnitType.None,
                    "current": "0",
                    "default": "500",
                    "possible": null,
                    "isReadOnly": false
                  },
                  "validation": {
                    "minimum": -1.7976931348623157e+308,
                    "maximum": 1.7976931348623157e+308,
                    "regex": null,
                    "isRequired": false
                  },
                  "subEntries": [],
                  "prototypes": []
                },
                {
                  "displayName": "MonitoringIntervalMs",
                  "identifier": "MonitoringIntervalMs",
                  "description": "Time in milliseconds to check if connection is still open. Disable with -1",
                  "value": {
                    "type": EntryValueType.Int32,
                    "unitType": EntryUnitType.None,
                    "current": "0",
                    "default": "5000",
                    "possible": null,
                    "isReadOnly": false
                  },
                  "validation": {
                    "minimum": -1.7976931348623157e+308,
                    "maximum": 1.7976931348623157e+308,
                    "regex": null,
                    "isRequired": false
                  },
                  "subEntries": [],
                  "prototypes": []
                },
                {
                  "displayName": "MonitoringTimeoutMs",
                  "identifier": "MonitoringTimeoutMs",
                  "description": "Timeout for a monitoring call",
                  "value": {
                    "type": EntryValueType.Int32,
                    "unitType": EntryUnitType.None,
                    "current": "0",
                    "default": "500",
                    "possible": null,
                    "isReadOnly": false
                  },
                  "validation": {
                    "minimum": -1.7976931348623157e+308,
                    "maximum": 1.7976931348623157e+308,
                    "regex": null,
                    "isRequired": false
                  },
                  "subEntries": [],
                  "prototypes": []
                }
              ],
              "prototypes": []
            },
            {
              "displayName": "TcpListenerConfig",
              "identifier": "TcpListenerConfig",
              "description": null,
              "value": {
                "type": EntryValueType.Class,
                "unitType": EntryUnitType.None,
                "current": "TcpListenerConfig",
                "default": "TcpListenerConfig",
                "possible": [
                  "BinaryConnectionConfig",
                  "TcpClientConfig",
                  "TcpListenerConfig"
                ],
                "isReadOnly": false
              },
              "validation": {
                "minimum": -1.7976931348623157e+308,
                "maximum": 1.7976931348623157e+308,
                "regex": null,
                "isRequired": false
              },
              "subEntries": [
                {
                  "displayName": "PluginName",
                  "identifier": "PluginName",
                  "description": null,
                  "value": {
                    "type": EntryValueType.String,
                    "unitType": EntryUnitType.None,
                    "current": "TcpListenerConnection",
                    "default": null,
                    "possible": null,
                    "isReadOnly": true
                  },
                  "validation": {
                    "minimum": -1.7976931348623157e+308,
                    "maximum": 1.7976931348623157e+308,
                    "regex": null,
                    "isRequired": false
                  },
                  "subEntries": [],
                  "prototypes": []
                },
                {
                  "displayName": "IpAdress",
                  "identifier": "IpAdress",
                  "description": "The IPAdress for this device",
                  "value": {
                    "type": EntryValueType.String,
                    "unitType": EntryUnitType.None,
                    "current": "0.0.0.0",
                    "default": "0.0.0.0",
                    "possible": null,
                    "isReadOnly": false
                  },
                  "validation": {
                    "minimum": -1.7976931348623157e+308,
                    "maximum": 1.7976931348623157e+308,
                    "regex": null,
                    "isRequired": false
                  },
                  "subEntries": [],
                  "prototypes": []
                },
                {
                  "displayName": "Port",
                  "identifier": "Port",
                  "description": "The TCP-Port for this Device",
                  "value": {
                    "type": EntryValueType.Int32,
                    "unitType": EntryUnitType.None,
                    "current": "0",
                    "default": "5002",
                    "possible": null,
                    "isReadOnly": false
                  },
                  "validation": {
                    "minimum": -1.7976931348623157e+308,
                    "maximum": 1.7976931348623157e+308,
                    "regex": null,
                    "isRequired": false
                  },
                  "subEntries": [],
                  "prototypes": []
                },
                {
                  "displayName": "ValidateBeforeAssignment",
                  "identifier": "ValidateBeforeAssignment",
                  "description": "Validate incoming messages before assigning the connection, even if this is the only listener.",
                  "value": {
                    "type": EntryValueType.Boolean,
                    "unitType": EntryUnitType.None,
                    "current": "False",
                    "default": "False",
                    "possible": null,
                    "isReadOnly": false
                  },
                  "validation": {
                    "minimum": -1.7976931348623157e+308,
                    "maximum": 1.7976931348623157e+308,
                    "regex": null,
                    "isRequired": false
                  },
                  "subEntries": [],
                  "prototypes": []
                },
                {
                  "displayName": "MonitoringIntervalMs",
                  "identifier": "MonitoringIntervalMs",
                  "description": "Time in milliseconds to check if connection is still open. Disable with -1",
                  "value": {
                    "type": EntryValueType.Int32,
                    "unitType": EntryUnitType.None,
                    "current": "0",
                    "default": "5000",
                    "possible": null,
                    "isReadOnly": false
                  },
                  "validation": {
                    "minimum": -1.7976931348623157e+308,
                    "maximum": 1.7976931348623157e+308,
                    "regex": null,
                    "isRequired": false
                  },
                  "subEntries": [],
                  "prototypes": []
                },
                {
                  "displayName": "MonitoringTimeoutMs",
                  "identifier": "MonitoringTimeoutMs",
                  "description": "Timeout for a monitoring call",
                  "value": {
                    "type": EntryValueType.Int32,
                    "unitType": EntryUnitType.None,
                    "current": "0",
                    "default": "500",
                    "possible": null,
                    "isReadOnly": false
                  },
                  "validation": {
                    "minimum": -1.7976931348623157e+308,
                    "maximum": 1.7976931348623157e+308,
                    "regex": null,
                    "isRequired": false
                  },
                  "subEntries": [],
                  "prototypes": []
                }
              ],
              "prototypes": []
            }
          ]
        }
      ],
      "prototypes": []
  }

  entry3: Entry = {
   "displayName": "AcquiredCapabilities",
    "identifier": "AcquiredCapabilities",
    "description": null,
    "value": {
      "type": EntryValueType.Class,
      "unitType": EntryUnitType.None,
      "current": "SimpleSkill",
      "default": "AssemblyCapability",
      "possible": [
        "AssemblyCapability",
        "CombinedCapabilities",
        "NullCapabilities",
        "SimpleSkill"
      ],
      "isReadOnly": false
    },
    "validation": {
      "minimum": -1.7976931348623157e+308,
      "maximum": 1.7976931348623157e+308,
      "regex": null,
      "isRequired": false
    },
    "subEntries": [
      {
        "displayName": "Name",
        "identifier": "Name",
        "description": null,
        "value": {
          "type": EntryValueType.String,
          "unitType": EntryUnitType.None,
          "current": "This is the name",
          "default": null,
          "possible": null,
          "isReadOnly": false
        },
        "validation": {
          "minimum": -1.7976931348623157e+308,
          "maximum": 1.7976931348623157e+308,
          "regex": null,
          "isRequired": false
        },
        "subEntries": [],
        "prototypes": []
      },
      {
        "displayName": "Description",
        "identifier": "Description",
        "description": null,
        "value": {
          "type": EntryValueType.String,
          "unitType": EntryUnitType.None,
          "current": "This is the description",
          "default": null,
          "possible": null,
          "isReadOnly": false
        },
        "validation": {
          "minimum": -1.7976931348623157e+308,
          "maximum": 1.7976931348623157e+308,
          "regex": null,
          "isRequired": false
        },
        "subEntries": [],
        "prototypes": []
      }
    ],
    "prototypes": [
      {
        "displayName": "AssemblyCapability",
        "identifier": "AssemblyCapability",
        "description": null,
        "value": {
          "type": EntryValueType.Class,
          "unitType": EntryUnitType.None,
          "current": "AssemblyCapability",
          "default": "AssemblyCapability",
          "possible": null,
          "isReadOnly": false
        },
        "validation": {
          "minimum": -1.7976931348623157e+308,
          "maximum": 1.7976931348623157e+308,
          "regex": null,
          "isRequired": false
        },
        "subEntries": [
          {
            "displayName": "AnotherProperty",
            "identifier": "AnotherProperty",
            "description": null,
            "value": {
              "type": EntryValueType.String,
              "unitType": EntryUnitType.None,
              "current": "",
              "default": null,
              "possible": null,
              "isReadOnly": false
            },
            "validation": {
              "minimum": -1.7976931348623157e+308,
              "maximum": 1.7976931348623157e+308,
              "regex": null,
              "isRequired": false
            },
            "subEntries": [],
            "prototypes": []
          }
        ],
        "prototypes": []
      },
      {
        "displayName": "SimpleSkill",
        "identifier": "SimpleSkill",
        "description": null,
        "value": {
          "type": EntryValueType.Class,
          "unitType": EntryUnitType.None,
          "current": "SimpleSkill",
          "default": "SimpleSkill",
          "possible": null,
          "isReadOnly": false
        },
        "validation": {
          "minimum": -1.7976931348623157e+308,
          "maximum": 1.7976931348623157e+308,
          "regex": null,
          "isRequired": false
        },
        "subEntries": [
          {
            "displayName": "Name",
            "identifier": "Name",
            "description": null,
            "value": {
              "type": EntryValueType.String,
              "unitType": EntryUnitType.None,
              "current": null,
              "default": null,
              "possible": null,
              "isReadOnly": false
            },
            "validation": {
              "minimum": -1.7976931348623157e+308,
              "maximum": 1.7976931348623157e+308,
              "regex": null,
              "isRequired": false
            },
            "subEntries": [],
            "prototypes": []
          },
          {
            "displayName": "Description",
            "identifier": "Description",
            "description": null,
            "value": {
              "type": EntryValueType.String,
              "unitType": EntryUnitType.None,
              "current": null,
              "default": null,
              "possible": null,
              "isReadOnly": false
            },
            "validation": {
              "minimum": -1.7976931348623157e+308,
              "maximum": 1.7976931348623157e+308,
              "regex": null,
              "isRequired": false
            },
            "subEntries": [],
            "prototypes": []
          }
        ],
        "prototypes": []
      }
    ]
  }


  entry4: Entry = {
      "displayName": "AssemblyCell",
      "identifier": "AssemblyCell",
      "description": null,
      "value": {
        "type": EntryValueType.Class,
        "unitType": EntryUnitType.None,
        "current": "AssemblyCell",
        "default": "AssemblyCell",
        "possible": null,
        "isReadOnly": false
      },
      "validation": {
        "minimum": -1.7976931348623157e+308,
        "maximum": 1.7976931348623157e+308,
        "regex": null,
        "isRequired": false
      },
      "subEntries": [
        {
          "displayName": "Nominal Power",
          "identifier": "NominalPower",
          "description": null,
          "value": {
            "type": EntryValueType.Int32,
            "unitType": EntryUnitType.None,
            "current": "225",
            "default": "0",
            "possible": null,
            "isReadOnly": true
          },
          "validation": {
            "minimum": -1.7976931348623157e+308,
            "maximum": 1.7976931348623157e+308,
            "regex": null,
            "isRequired": false
          },
          "subEntries": [],
          "prototypes": []
        },
        {
          "displayName": "CameraInterface",
          "identifier": "CameraInterface",
          "description": null,
          "value": {
            "type": EntryValueType.String,
            "unitType": EntryUnitType.None,
            "current": null,
            "default": null,
            "possible": [],
            "isReadOnly": false
          },
          "validation": {
            "minimum": -1.7976931348623157e+308,
            "maximum": 1.7976931348623157e+308,
            "regex": null,
            "isRequired": false
          },
          "subEntries": [],
          "prototypes": []
        },
        {
          "displayName": "Material Identifier",
          "identifier": "MaterialIdentifier",
          "description": null,
          "value": {
            "type": EntryValueType.String,
            "unitType": EntryUnitType.None,
            "current": "0031465",
            "default": null,
            "possible": null,
            "isReadOnly": true
          },
          "validation": {
            "minimum": -1.7976931348623157e+308,
            "maximum": 1.7976931348623157e+308,
            "regex": null,
            "isRequired": false
          },
          "subEntries": [],
          "prototypes": []
        },
        {
          "displayName": "Reservations",
          "identifier": "Reservations",
          "description": null,
          "value": {
            "type": EntryValueType.Collection,
            "unitType": EntryUnitType.None,
            "current": null,
            "default": "String",
            "possible": [
              "String"
            ],
            "isReadOnly": false
          },
          "validation": {
            "minimum": -1.7976931348623157e+308,
            "maximum": 1.7976931348623157e+308,
            "regex": null,
            "isRequired": false
          },
          "subEntries": [],
          "prototypes": [
            {
              "displayName": "String",
              "identifier": "CREATED",
              "description": null,
              "value": {
                "type": EntryValueType.String,
                "unitType": EntryUnitType.None,
                "current": "",
                "default": "",
                "possible": null,
                "isReadOnly": false
              },
              "validation": {
                "minimum": -1.7976931348623157e+308,
                "maximum": 1.7976931348623157e+308,
                "regex": null,
                "isRequired": false
              },
              "subEntries": [],
              "prototypes": []
            }
          ]
        },
        {
          "displayName": "Instance Count",
          "identifier": "InstanceCount",
          "description": null,
          "value": {
            "type": EntryValueType.Int32,
            "unitType": EntryUnitType.None,
            "current": "0",
            "default": "0",
            "possible": null,
            "isReadOnly": false
          },
          "validation": {
            "minimum": -1.7976931348623157e+308,
            "maximum": 1.7976931348623157e+308,
            "regex": null,
            "isRequired": false
          },
          "subEntries": [],
          "prototypes": []
        },
        {
          "displayName": "Manual Mode",
          "identifier": "ManualMode",
          "description": null,
          "value": {
            "type": EntryValueType.Boolean,
            "unitType": EntryUnitType.None,
            "current": "False",
            "default": "False",
            "possible": null,
            "isReadOnly": false
          },
          "validation": {
            "minimum": -1.7976931348623157e+308,
            "maximum": 1.7976931348623157e+308,
            "regex": null,
            "isRequired": false
          },
          "subEntries": [],
          "prototypes": []
        },
        {
          "displayName": "State",
          "identifier": "CellState",
          "description": null,
          "value": {
            "type": EntryValueType.String,
            "unitType": EntryUnitType.None,
            "current": "Idle",
            "default": null,
            "possible": null,
            "isReadOnly": false
          },
          "validation": {
            "minimum": -1.7976931348623157e+308,
            "maximum": 1.7976931348623157e+308,
            "regex": null,
            "isRequired": false
          },
          "subEntries": [],
          "prototypes": []
        },
        {
          "displayName": "Disabled",
          "identifier": "Disabled",
          "description": null,
          "value": {
            "type": EntryValueType.Boolean,
            "unitType": EntryUnitType.None,
            "current": "False",
            "default": "False",
            "possible": null,
            "isReadOnly": false
          },
          "validation": {
            "minimum": -1.7976931348623157e+308,
            "maximum": 1.7976931348623157e+308,
            "regex": null,
            "isRequired": false
          },
          "subEntries": [],
          "prototypes": []
        }
      ],
      "prototypes": []
    }
  ngOnInit(): void {}

  onToggle() {
    this.disabled = !this.disabled;
  }
}
