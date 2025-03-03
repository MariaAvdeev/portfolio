import { isRGB } from '@telegram-apps/sdk-react';
import { Cell, Checkbox, Section } from '@telegram-apps/telegram-ui';
import React from 'react';

import { Link } from '@/components/Link/Link.jsx';

import './DisplayData.css';


export const DisplayData = ({ header, rows }) => (
  <Section header={header}>
    {rows.map((item, idx) => {
      let valueNode;

      if (item.value === undefined) {
        valueNode = <i>empty</i>;
      } else {
        if ('type' in item) {
          valueNode = <Link to={item.value}>Open</Link>;
        } else if (typeof item.value === 'string') {
          valueNode = isRGB(item.value)
            ? <RGB color={item.value}/>
            : item.value;
        } else if (typeof item.value === 'boolean') {
          valueNode = <Checkbox checked={item.value} disabled/>;
        } else {
          valueNode = item.value;
        }
      }

      return (
        <Cell
          className='display-data__line'
          subhead={item.title}
          readOnly
          multiline={true}
          key={idx}
        >
          <span className='display-data__line-value'>
            {valueNode}
          </span>
        </Cell>
      );
    })}
  </Section>
);
