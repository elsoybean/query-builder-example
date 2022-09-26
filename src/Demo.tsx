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
  fields: {
    encounter_date: {
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
    encounter_type: {
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
    diagnosis: {
      label: 'Diagnosis',
      type: '!struct',
      subfields: {
        group: {
          type: 'select',
          label: 'Diagnosis Group',
          valueSources: ['value'],
          fieldSettings: {
            listValues: [
              {
                value: 'dailyPlanet-j11-diagnosis',
                title: 'Asthma (Daily Planet)',
              },
            ],
          },
        },
      },
    },
    procedure: {
      label: 'Procedure',
      type: '!struct',
      subfields: {
        group: {
          type: 'select',
          label: 'Procedure Group',
          valueSources: ['value'],
          fieldSettings: {
            listValues: [
              {
                value: 'dailyPlanet-d17a-procedure',
                title:
                  'Hepatoportoenterostomy or Kasai procedure on a patient with biliary atresia (Daily Planet D17.a)',
              },
              {
                value: 'dailyPlanet-d17b-procedure',
                title:
                  'Laparoscopic gastrointestinal, hepatic, and pancreatic surgery (Daily Planet D17.b)',
              },
              {
                value: 'dailyPlanet-d17c-procedure',
                title: 'Bariatric surgery (Daily Planet D17.c)',
              },
              {
                value: 'dailyPlanet-d17d-procedure',
                title:
                  'Posterior sagittal anorectoplasties (Pena) for imperforate anus (Daily Planet D17.d)',
              },
              {
                value: 'dailyPlanet-d17e-procedure',
                title:
                  'Open abdominal surgeries for inflammatory bowel disease (IBD) (Daily Planet D17.e)',
              },
              {
                value: 'dailyPlanet-d17f-procedure',
                title:
                  'Laparoscopic abdominal surgeries for inflammatory bowel disease (IBD) (Daily Planet D17.f)',
              },
            //   {
            //     value: 'dailyPlanet-d17a-procedure',
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
          type: 'select',
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
    pediatric: {
      label: 'Pediatric',
      type: 'boolean',
      operators: ['equal'],
      valueSources: ['value'],
    },
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

      const jsonTree = QbUtils.getTree(immutableTree);
      console.log(jsonTree);
      // `jsonTree` can be saved to backend, and later loaded to `queryValue`
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
