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
  { name: "months", type: "column", source: "source", allowMultiple: false},
  { name: "profits", type: "column", source: "source", allowMultiple: false}
]);

const allData = (config, sigmaData) => {
  if (!sigmaData[config['months']] && !sigmaData[config['profits']]) {
    return false;
  }

  return true;
}

const getData = (config, sigmaData) => {

  if (allData(config, sigmaData)) {

    const data = sigmaData[config['months']].map((month, i) => {
      
      var d = new Date(month)
      var month_string = d.toDateString().split(' ')[1];
      var year_string = d.toDateString().split(' ')[3];

      return {
        name: month_string + ' ' + year_string,
        y: sigmaData[config['profits']][i]
      };
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
        text: null
      },
      legend: {
        enabled: false
      },
      tooltip: {
        // pointFormat: "<b>${point.y:,.2f}</b> USD"
        enabled: true,
        formatter: function () {
          var num = this.y / 1000;
          var suffix = 'K';
          var prefix = '';

          if (Math.abs(num) > 999) {
            // this is in the millions
            num = num / 1000;
            suffix = 'M';
          }

          if (num < 0) {
            prefix = '-';
          }
          
          var output = this.key;
          return output+ `:   ${prefix}$` + Math.abs(num.toPrecision(3)).toString() + suffix + ' USD';
        },
        style: {
            fontWeight: 'bold'
        }
      },
      xAxis: {
        type: "category",
        lineWidth: 0
      },
      series: [{
        upColor: Highcharts.getOptions().colors[2],
        color: Highcharts.getOptions().colors[8],
        data: data
      }]
    };

  }
}



const useMain = () => {
  
  // Receive config and element data objects from Sigma
  const config = useConfig();
  const sigmaData = useElementData(config.source);
  
  const payload = useMemo(() => getData(config, sigmaData), [config, sigmaData]);

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
