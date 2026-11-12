
import { 
    View, Text, Alert,
    TouchableOpacity, TextInput, 
    //ActivityIndicatorBase,
    ActivityIndicator 
} from 'react-native'
import { 
    ExpandableCalendar,
    TimelineEventProps,
    TimelineList,
    CalendarProvider,
    TimelineProps,
    CalendarUtils
} from 'react-native-calendars'
import { getDate } from "../../lib/utils.js"
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Show, useUser } from '@clerk/expo'
import { API_URL } from "../../constants/api";
import { styles } from "../../assets/styles/create.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

// Fuck this thing
//import { CalendarBody, CalendarContainer, CalendarHeader } from '@howljs/calendar-kit';

export default function ScheduleScreen() {
    const router = useRouter();
    const { user } = useUser();
    const [selectedDay, setSelectedDay] = useState("")
    
    const currentDate = getDate()
    const markedDays = {
        [`${getDate(-1)}`]: {marked: true},
        [`${getDate()}`]: {marked: true},
        [`${getDate(1)}`]: {marked: true},
        [`${getDate(2)}`]: {marked: true},
        [`${getDate(4)}`]: {marked: true}
    };
    const INITIAL_TIME = {hour: 9, minutes: 0};

    const trainingSessions: { [key: string]: TimelineEventProps[]} = {}

    const createNewTrainingSession = async () => {
        // TODO
        return 
    }

    const approveNewTrainingSession = async () => {
        // TODO
        return
    }

    const timelineProps: Partial<TimelineProps> = {
        format24h: true,
        onBackgroundLongPress: createNewTrainingSession,
        onBackgroundLongPressOut: approveNewTrainingSession,
        // scrollToFirst: true,
        // start: 0,
        // end: 24,
        unavailableHours: [{start: 0, end: 6}, {start: 22, end: 24}],
        overlapEventsSpacing: 8,
        rightEdgeSpacing: 24
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" color={COLORS.text} size={24}/>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Schedule Event</Text>
            </View>

            {/* <View style={styles.card}>
                <Calendar 
                    onDayPress={(day)=> setSelectedDay(day.dateString)}
                    markedDates={{
                        [selectedDay] : {selected: true, selectedColor: "#4CAF50"}
                    }}
                />
            </View> */}

            <CalendarProvider date={currentDate}>
                <ExpandableCalendar
                    firstDay={1}
                    leftArrowImageSource={require('../../assets/images/previous.png')}
                    rightArrowImageSource={require('../../assets/images/next.png')}
                    markedDates={markedDays}
                />
                <TimelineList
                    events={trainingSessions}
                    timelineProps={timelineProps}
                    showNowIndicator
                    scrollToFirst
                    initialTime={INITIAL_TIME}
                />
            </CalendarProvider>
            
        </View>

        
    )
}

//export default ScheduleScreen 