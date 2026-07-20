import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { formatFaText } from "@/lib/pdfHelper";
import type { DayItem, WorkoutPlan } from "@/types/workout";

Font.register({
  family: "Vazir",
  src: "/fonts/vazir.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Vazir",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    paddingBottom: 10,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4c1d95",
  },
  card: {
    marginBottom: 10,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "flex-end",
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  details: {
    fontSize: 10,
    color: "#6b7280",
  },
});

interface WorkoutPdfProps {
  workoutPlan: WorkoutPlan;
  workoutDays: DayItem[];
}

export default function WorkoutPdfDocument({
  workoutPlan,
  workoutDays,
}: WorkoutPdfProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {formatFaText(workoutPlan.title || "برنامه تمرینی")}
          </Text>
        </View>

        {workoutDays.map((day) => (
          <View key={day._id} style={styles.card}>
            <Text style={styles.exerciseName}>
              {formatFaText(`${day.dayName} - تمرین: ${day.muscleGroup}`)}
            </Text>
            {day.exercises.map((ex, index) => (
              <Text key={ex._id} style={styles.details}>
                {formatFaText(
                  `${index + 1}. ${ex.name} - ${ex.sets} ست - ${ex.reps} تکرار`,
                )}
              </Text>
            ))}
          </View>
        ))}
      </Page>
    </Document>
  );
}
