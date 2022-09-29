import React, { useState, useCallback } from 'react';
import { Query, Builder, Utils as QbUtils } from 'react-awesome-query-builder';
import MuiConfig from 'react-awesome-query-builder/lib/config/mui';
import { CopyBlock, monoBlue } from 'react-code-blocks';

import type {
  JsonGroup,
  Config,
  ImmutableTree,
  BuilderProps,
} from 'react-awesome-query-builder';

import 'react-awesome-query-builder/lib/css/styles.css';
import { Typography } from '@mui/material';
//import "react-awesome-query-builder/lib/css/compact_styles.css"; //optional, for more compact styles

const InitialConfig = MuiConfig;

// You need to provide your own config. See below 'Config format'
const config: Config = {
  ...InitialConfig,
  operators: {
    ...InitialConfig.operators,
    segment_is: {
      ...InitialConfig.operators.select_equals,
      jsonLogic: 'segment_is',
    },
    segment_any: {
      ...InitialConfig.operators.select_any_in,
      jsonLogic: 'segment_any',
    },
  },
  types: {
    ...InitialConfig.types,
    segment: {
      ...InitialConfig.types.select,
      defaultOperator: 'segment_is',
      widgets: {
        field: {},
        func: {},
        select: {
          ...InitialConfig.types.select.widgets.select,
          operators: ['segment_is'],
        },
        multiselect: {
          ...InitialConfig.types.select.widgets.multiselect,
          operators: ['segment_any'],
        },
      },
    },
  },
  fields: {
    encounter: {
      label: 'Encounter',
      type: '!struct',
      subfields: {
        type: {
          label: 'Encounter Type',
          type: 'select',
          valueSources: ['value'],
          fieldSettings: {
            listValues: [
              { value: 'Ambulatory Surgery', title: 'Ambulatory Surgery' },
              { value: 'Emergency Department', title: 'Emergency Department' },
              { value: 'Inpatient', title: 'Inpatient' },
              { value: 'Observation', title: 'Observation' },
            ],
          },
        },
        date: {
          label: 'Date',
          type: '!struct',
          subfields: {
            date: {
              label: 'Encounter Date',
              type: 'date',
              fieldSettings: {
                dateFormat: 'MM/DD/YYYY',
              },
              valueSources: ['value'],
            },
            calendar_year: {
              label: 'Calendar Year',
              type: 'number',
              fieldSettings: {
                min: 2015,
                max: new Date().getFullYear(),
              },
              valueSources: ['value'],
            },
          },
        },
      },
    },
    patient: {
      label: 'Patient',
      type: '!struct',
      subfields: {
        type: {
          label: 'Patient Type',
          type: 'select',
          valueSources: ['value'],
          fieldSettings: {
            listValues: [{ value: '???', title: '???' }],
          },
        },
        age: {
          label: 'Age',
          type: '!struct',
          subfields: {
            group: {
              label: 'Age Range',
              type: 'segment',
              fieldSettings: {
                listValues: [
                  { value: 'infant', title: 'Infant' },
                  { value: 'three-and-under', title: '3 and Under' },
                  { value: 'child', title: 'Child' },
                  { value: 'adolescent', title: 'Adolescent' },
                  { value: 'pediatric', title: 'Pediatric' },
                ],
              },
              valueSources: ['value'],
            },
            in_years: {
              label: 'Age (in years)',
              type: 'number',
              fieldSettings: {
                min: 0,
                max: 150,
              },
              valueSources: ['value'],
            },
            in_months: {
              label: 'Age (in months)',
              type: 'number',
              fieldSettings: {
                min: 0,
                max: 1800,
              },
              valueSources: ['value'],
            },
            in_days: {
              label: 'Age (in days)',
              type: 'number',
              fieldSettings: {
                min: 0,
                max: 54000,
              },
              valueSources: ['value'],
            },
          },
        },
        diagnosis: {
          label: 'Diagnosis',
          type: '!struct',
          subfields: {
            group: {
              type: 'segment',
              label: 'Diagnosis Group',
              valueSources: ['value'],
              fieldSettings: {
                listValues: [
                  {
                    value: 'dailyPlanet-j11',
                    title: 'Asthma (Daily Planet)',
                  },
                ],
              },
            },
          },
        },
      },
    },
    procedure: {
      label: 'Procedure',
      type: '!struct',
      subfields: {
        group: {
          type: 'segment',
          label: 'Procedure Group',
          valueSources: ['value'],
          fieldSettings: {
            listValues: [
              {
                value: 'dailyPlanet-d17a',
                title:
                  'Hepatoportoenterostomy or Kasai procedure on a patient with biliary atresia (Daily Planet D17.a)',
              },
              {
                value: 'dailyPlanet-d17b',
                title:
                  'Laparoscopic gastrointestinal, hepatic, and pancreatic surgery (Daily Planet D17.b)',
              },
              {
                value: 'dailyPlanet-d17c',
                title: 'Bariatric surgery (Daily Planet D17.c)',
              },
              {
                value: 'dailyPlanet-d17d',
                title:
                  'Posterior sagittal anorectoplasties (Pena) for imperforate anus (Daily Planet D17.d)',
              },
              {
                value: 'dailyPlanet-d17e',
                title:
                  'Open abdominal surgeries for inflammatory bowel disease (IBD) (Daily Planet D17.e)',
              },
              {
                value: 'dailyPlanet-d17f',
                title:
                  'Laparoscopic abdominal surgeries for inflammatory bowel disease (IBD) (Daily Planet D17.f)',
              },
              //   {
              //     value: 'dailyPlanet-d17a',
              //     title:
              //       'Congenital tracheo-esophageal fistula with or without esophageal atresia and congenital esophageal stenosis and stricture repair (see code list – must have both diagnosis and procedure code) (Daily Planet D17.g)',
              //   },
            ],
          },
        },
      },
    },
    provider: {
      label: 'Provider',
      type: '!struct',
      subfields: {
        group: {
          type: 'segment',
          label: 'Provider Group',
          valueSources: ['value'],
          fieldSettings: {
            listValues: [
              {
                value: 'pediatric-congenital-cardiology',
                title: 'Pediatric Congenital Cardiology',
              },
              {
                value: 'pediatric-cardiothoracic-survey',
                title: 'Pediatric Cardiothoracic Survey',
              },
              {
                value: 'pediatric-gi',
                title: 'Pediatric GI',
              },
              {
                value: 'pediatric-neurosurgery',
                title: 'Pediatric Neurosurgery',
              },
            ],
          },
        },
      },
    }, // price: {
    //   label: 'Price',
    //   type: 'number',
    //   valueSources: ['value'],
    //   fieldSettings: {
    //     min: 10,
    //     max: 100,
    //   },
    //   preferWidgets: ['slider', 'rangeslider'],
    // },
    // color: {
    //   label: 'Color',
    //   type: 'select',
    //   valueSources: ['value'],
    //   fieldSettings: {
    //     listValues: [
    //       { value: 'yellow', title: 'Yellow' },
    //       { value: 'green', title: 'Green' },
    //       { value: 'orange', title: 'Orange' },
    //     ],
    //   },
    // },
  },
};

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue: JsonGroup = { id: QbUtils.uuid(), type: 'group' };

export const Demo: React.FC = () => {
  const [state, setState] = useState({
    tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
    config: config,
  });

  const onChange = useCallback(
    (immutableTree: ImmutableTree, config: Config) => {
      // Tip: for better performance you can apply `throttle` - see `examples/demo`
      setState((prevState) => ({
        ...prevState,
        tree: immutableTree,
        config: config,
      }));
      console.log(config);
    },
    [],
  );

  const renderBuilder = useCallback(
    (props: BuilderProps) => (
      <div className="query-builder-container" style={{ padding: '10px' }}>
        <div className="query-builder qb-lite">
          <Builder {...props} />
        </div>
      </div>
    ),
    [],
  );

  return (
    <div>
      <Query
        {...config}
        value={state.tree}
        onChange={onChange}
        renderBuilder={renderBuilder}
      />
      <div className="query-builder-result">
        <Typography variant="h5">SQL where:</Typography>
        <CopyBlock
          text={QbUtils.sqlFormat(state.tree, state.config) || ''}
          language="sql"
          theme={monoBlue}
        />
        <Typography variant="h5">JsonLogic:</Typography>
        <CopyBlock
          text={JSON.stringify(
            QbUtils.jsonLogicFormat(state.tree, state.config),
            null,
            2,
          )}
          language="json"
          theme={monoBlue}
        />
        <Typography variant="h5">React Awesome Query Tree:</Typography>
        <CopyBlock
          text={JSON.stringify(QbUtils.getTree(state.tree), null, 2)}
          language="json"
          theme={monoBlue}
        />
      </div>
    </div>
  );
};

export default Demo;
