import {Dimensions} from 'react-native';
import { getISOWeek, format, set, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    LineChart,
  } from "react-native-chart-kit";

  
  
  const chartConfig = {
    backgroundGradientFrom: "#0000",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#0000",
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => `rgba(0, 180, 250, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false ,// optional
    
    
  };
  const formatValue = (value) => {
    if (value >= 1000) {
      return `${Math.round(value / 1000)}K`;
    }
    return value.toString();
  };
  
export default function Chart({delay, stepsData}) {
  const currentDate = new Date();
  const allDays = [];
  switch (delay) {
    case 'jours':
      for (let i = 4; i >= 0; i--) {
        const previousDay = subDays(currentDate, i);
        const formattedDay = format(previousDay, 'EEE', { locale: fr });
        allDays.push(formattedDay);
      }
      labelsDelay = allDays
      stepsCount = stepsData[2]?.map(item => item.count)
      break
    case 'semaines':
      const currentWeekNumber = getISOWeek(currentDate);
      const last5Weeks = Array.from({ length: 5 }, (_, i) => currentWeekNumber - i);
      const weekLabels = last5Weeks.map(weekNumber => `Sem ${weekNumber}`);
      labelsDelay = weekLabels.reverse();
      stepsCount= stepsData[1]?.map(item => item.count)

      break;
    case 'mois':
      const allMonths = ["Janv.", "Févr.", "Mars", "Avri.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Octo.", "Nove.", "Déce."];
      let fiveMonths = stepsData[0]
      labelsDelay = fiveMonths?.map(item => allMonths[item.month]);
      stepsCount= stepsData[0]?.map(item => item.count)
      break;
    default:
      break;
  }
  const data = {
    labels: labelsDelay,
    datasets: [
      {
        data: stepsCount,
        color: (opacity = 1) => `rgba(0, 180, 236, ${opacity})`, // optional
        strokeWidth: 2 // optional
      }
    ],
    
  };
  
  return (
      <LineChart
        data={data}
        width={Dimensions.get('window').width * 1}
        height={230}
        withDots= {false}
        chartConfig={chartConfig}
        bezier
        formatYLabel={formatValue}
        style={{
          borderRadius: 16,
        }}
      />
    
  )
}

