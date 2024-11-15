import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { SERVER_IP } from '@env';

const screenWidth = Dimensions.get('window').width;

interface UserDetails {
  id: number;
}

interface StatisticsTabProps {
  userDetails: UserDetails | null;
}

const StatisticsTab: React.FC<StatisticsTabProps> = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConsistency = async () => {
    if (!data) {
      console.error('User details are missing or invalid');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const endpoint = `http://${SERVER_IP}:3000/api/workout/consistency`;
      const response = await axios.get(endpoint, {
       
      });

      const workoutDates = response.data.map((item: { date: string }) => item.date);
      const dateCounts = workoutDates.reduce((acc: { [key: string]: number }, date: string) => {
        const day = new Date(date).toLocaleDateString();
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});

      const formattedData = Object.keys(dateCounts).map(date => ({
        date,
        count: dateCounts[date],
      }));

      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.totalSetsText}>Consistency Over Time</Text>
          <LineChart
            data={{
              labels: data.map(item => item.date),
              datasets: [{ data: data.map(item => item.count) }],
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