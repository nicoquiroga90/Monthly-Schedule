import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface ScheduleEntry {
  date: string;
  workers: string[];
}

interface Props {
  schedule: ScheduleEntry[];
  month: string;
  year: number;
}

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10 },
  header: { fontSize: 14, marginBottom: 10, textAlign: "center" },
  grid: { display: "flex", flexDirection: "row", flexWrap: "wrap" },
  dayCell: { width: "14%", border: "1px solid #000", padding: 4, marginBottom: 2 },
  worker: { fontSize: 8 }
});

export default function SchedulePDFDocument({ schedule, month, year }: Props) {
  return (
    <Document>
      <Page style={styles.page}>
        <Text style={styles.header}>Schedule for {month} {year}</Text>
        <View style={styles.grid}>
          {schedule.map((day) => (
            <View key={day.date} style={styles.dayCell}>
              <Text>{new Date(day.date).getDate()}</Text>
              {day.workers.map((w) => (
                <Text key={w} style={styles.worker}>{w}</Text>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
