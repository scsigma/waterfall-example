import React, {
  useState,
  useEffect,
  useMemo
} from 'react';

import { client, useConfig, useElementData } from '@sigmacomputing/plugin';

import Highcharts from 'highcharts';
import HighchartsMore from "highcharts/highcharts-more";
import HighchartsReact from 'highcharts-react-official';

HighchartsMore(Highcharts);


client.config.configureEditorPanel([
  { name: "source", type: "element"},
  { name: "open", type: "column", source: "source", allowMultiple: false},
  { name: "high", type: "column", source: "source", allowMultiple: false},
  { name: "low", type: "column", source: "source", allowMultiple: false},
  { name: "close", type: "column", source: "source", allowMultiple: false},
  { name: "date", type: "column", source: "source", allowMultiple: false},
  { name: "volume", type: "column", source: "source", allowMultiple: false},
  { name: "symbol", type: "column", source: "source", allowMultiple: false}
]);


const App = () => {
  
  const options = {
    chart: {
      type: 'waterfall'
    },
    series: [{
        data: [{
        //    x: 1,
            y: 120000
        }, {
        //    x: 2,
            y: 569000
        }, {
        //    x: 3,
            y: 231000
        },  {
        //    x: 4,
            y: -342000
        }, {
        //    x: 5,
            y: -233000
        }]        
    }]
  };
  
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options}/>
    </div>
  );
}

export default App;
