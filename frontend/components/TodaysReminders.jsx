import { View, Text, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getMedications } from '../app/api';
import { format, isToday, parseISO } from 'date-fns';

export default function TodaysReminders() {
  const [medications, setMedications] = useState([]);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const meds = await getMedications();
        setMedications(meds);
      } catch (error) {
        console.error('Error fetching medications:', error);
      }
    };

    fetchMedications();
  }, []);

  // Filter medications that have reminders for today
  const todaysReminders = medications.filter((med) => {
    if (!med.reminder_times || med.reminder_times.length === 0) return false;
    return med.reminder_times.some((time) => {
      const reminderDate = parseISO(time);
      return isToday(reminderDate);
    });
  });

  const renderReminderItem = ({ item }) => (
    <View style={styles.reminderItem}>
      <Text style={styles.reminderTitle}>{item.med_name}</Text>
      <Text style={styles.reminderBody}>{item.description}</Text>
      {item.reminder_times.map((time, index) => (
        <Text key={index} style={styles.reminderTime}>
          Reminder at: {format(parseISO(time), 'hh:mm a')}
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Today's Reminders</Text>
      <FlatList
        data={todaysReminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderReminderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        nestedScrollEnabled={true}
        ListEmptyComponent={() => (
          <Text style={styles.noReminders}>No reminders for today</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    padding: 15,
    backgroundColor: '#1E1F28',
    borderRadius: 15,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  reminderItem: {
    backgroundColor: '#2E7D32',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  reminderBody: {
    color: '#fff',
    marginTop: 5,
  },
  reminderTime: {
    color: '#A5D6A7',
    marginTop: 5,
    fontStyle: 'italic',
  },
  noReminders: {
    color: '#A5D6A7',
    marginTop: 10,
    textAlign: 'center',
  },
});
