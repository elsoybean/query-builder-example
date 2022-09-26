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
    qty: {
      label: 'Qty',
      type: 'number',
      fieldSettings: {
        min: 0,
      },
      valueSources: ['value'],
      preferWidgets: ['number'],
    },
    price: {
      label: 'Price',
      type: 'number',
      valueSources: ['value'],
      fieldSettings: {
        min: 10,
        max: 100,
      },
      preferWidgets: ['slider', 'rangeslider'],
    },
    color: {
      label: 'Color',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        listValues: [
          { value: 'yellow', title: 'Yellow' },
          { value: 'green', title: 'Green' },
          { value: 'orange', title: 'Orange' },
        ],
      },
    },
    is_promotion: {
      label: 'Promo?',
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
        <Typography variant="h5">Query string:</Typography>
        <CopyBlock
          text={QbUtils.queryString(state.tree, state.config) || ''}
          theme={monoBlue}
          language="text"
        />
        <Typography variant="h5">MongoDb query:</Typography>
        <CopyBlock
          text={
            JSON.stringify(
              QbUtils.mongodbFormat(state.tree, state.config),
              null,
              2,
            ) || ''
          }
          language="json"
          theme={monoBlue}
        />
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
        <Typography variant="h5">SpEL:</Typography>
        <CopyBlock
          text={QbUtils.spelFormat(state.tree, state.config)}
          language="java"
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
