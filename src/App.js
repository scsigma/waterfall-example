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


// ------------------------------------------------------------------------------------------

client.config.configureEditorPanel([
  { name: "source", type: "element"},
  { name: "x", type: "column", source: "source", allowMultiple: false},
  { name: "y", type: "column", source: "source", allowMultiple: false}
]);

// ------------------------------------------------------------------------------------------

const allSigmaDataReceived = (config, sigmaData) => {
  if (!sigmaData[config['x']] && !sigmaData[config['y']]) {
    return false;
  }

  return true;
}

//

const getSigmaData = (config, sigmaData) => {

  // Async data conditional
  if (!allSigmaDataReceived(config, sigmaData)) return null;

  // Create the data object that fits into the highcharts series
  // Call to attention how the formatting is for highcharts
  const data = sigmaData[config['x']].map((month, i) => {
    
    let date = new Date(month)
    let month_string = date.toDateString().split(' ')[1];
    let year_string = date.toDateString().split(' ')[3];

    let res = {
      name: month_string + ' ' + year_string,
      y: sigmaData[config['y']][i]
    };


    return res;
  });

  // add the last total balance object to the data list
  data.push({
    name: 'Total Profit',
    isSum: true,
    color: Highcharts.getOptions().colors[1]
  })

  return {
    chart: {
      type: 'waterfall',
    },
    title: {
      text: 'Waterfall Chart'
    },
    legend: {
      enabled: false
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      enabled: true,
      title: {
        text: 'Profit'
      }
    },
    tooltip: {
      // Default Point format
      // pointFormat: "<b>${point.y:,.2f}</b> USD"

      // More Clean Tooltip formatter
      enabled: true,
      formatter: function () {

        let num = Math.abs(this.y) >= 1000000 ? this.y / 1000000 : this.y / 1000;
        let prefix = this.y >= 0 ? '$' : '-$';
        let suffix = Math.abs(this.y) >= 1000000 ? 'M USD' : 'K USD';
        
        let output_num = Math.abs(num.toPrecision(3)).toString() 

        let month_year = this.key;
        return `${month_year} :    ${prefix + output_num + suffix}`;
      }
    },
    series: [{
      upColor: Highcharts.getOptions().colors[2],
      color: Highcharts.getOptions().colors[8],
      data: data
    }]
  };
}



const useMain = () => {
  
  // Receive config and element data objects from Sigma
  const config = useConfig();
  const sigmaData = useElementData(config.source);
  
  const payload = useMemo(() => getSigmaData(config, sigmaData), [config, sigmaData]);

  const [res, setRes] = useState(null);

  useEffect(() => {
    setRes(payload);
  }, [payload]);

  return res;
}

const App = () => { 
  const options = useMain();
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options}/>
    </div>
  );
}

export default App;