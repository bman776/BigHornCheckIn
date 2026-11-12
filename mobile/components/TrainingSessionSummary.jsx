import { View, Text } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

export const TrainingSessionSummary = ({ summary }) => {
    return(
        <View style={styles.card}>
            <Text>{summary.title}</Text>
            <Text>Start Time: {summary.start_time}</Text>
            <Text>End Time: {summary.end_time}</Text>
            <Text>Description: {summary.description}</Text>
        </View>
    )
    
}