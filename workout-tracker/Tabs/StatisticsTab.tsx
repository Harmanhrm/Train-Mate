import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import { SERVER_IP } from '@env';
const screenWidth = Dimensions.get('window').width;

const StatisticsTab = ({ userDetails }) => {
  const [timePeriod, setTimePeriod] = useState('all-time');
  const [data, setData] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let endpoint = '';
        if (timePeriod === 'all-time') {
          endpoint = `http://${SERVER_IP}:3000/api/sets/all-time`;
        } else if (timePeriod === 'day') {
          endpoint = `http://${SERVER_IP}:3000/api/sets/day`;
        } else if (timePeriod === 'week') {
          endpoint = `http://${SERVER_IP}:3000/api/sets/week`;
        }

        const response = await axios.get(endpoint, {
          params: { userId: userDetails.id },
        });

        setData(response.data.count);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [timePeriod]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setTimePeriod(value)}
          items={[
            { label: 'All Time', value: 'all-time' },
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
          ]}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select Time Period', value: '' }}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.totalSetsText}>Total Sets: {data}</Text>
          <BarChart
            data={{
              labels: ['Sets'],
              datasets: [{ data: [data] }],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            style={styles.chart}
            yAxisLabel=""
            yAxisSuffix=""
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  pickerContainer: {
    marginBottom: 20,
    width: '100%',
  },
  totalSetsText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    backgroundColor: 'white',
  },
});

const chartConfig = {
  backgroundColor: '#e26a00',
  backgroundGradientFrom: '#fb8c00',
  backgroundGradientTo: '#ffa726',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

export default StatisticsTab;