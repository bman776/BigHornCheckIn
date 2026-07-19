// react custom hook for Training Sessions

import { useState, useCallback } from "react"
import { Alert } from "react-native"

const API_URL = "https://bighorncheckin-api.onrender.com" 

export const useTrainingSessions = (trainerID) => {
    const [trainingSessions, setTrainingSessions] = useState([])
    const [nextTrainingSession, setNextTrainingSession] = useState({
        title: "<Training Session Title>",
        startTime: "<Start Time>",
        endTime: "<End Time>",
        checkedIn: [],
        awaiting: []
    });
    const [isLoading, setIsLoading] = useState(true);

    // useCallback is used for performance reasons, it will memoize the function
    const getAllTrainingSessionsForTrainer = useCallback(async () => {
        try{
            const response = await fetch(`${API_URL}/allTrainingSessionsForTrainer/${trainerID}`);
            const data = await response.json();
            setTrainingSessions(data)
        } catch (error) {
            console.error("Error, failed to get Training Sessions", error)
        }
    }, [trainerID]) 

    const getNextTrainingSessionForTrainer = useCallback(async () => {
        try{
            const response = await fetch(`${API_URL}/trainingSession/nextTrainingSessionForTrainer${trainerID}`);
            const data = await response.json();
            setNextTrainingSession(data)
        } catch (error) {
            console.error("Error, failed to get next Training Session", error)
        }
    }, [trainerID]) 

    const loadData = useCallback(async () => {
        if (!trainerID) return;

        setIsLoading(true)
        try {
            // data retreival functions run in parallel for sake of performance
            await Promise.all([getAllTrainingSessionsForTrainer(), getNextTrainingSessionForTrainer()]);
        } catch (error) {
            console.error("Error loading data", error);
        } finally {
            setIsLoading(false)
        }
    }, [getAllTrainingSessionsForTrainer, getNextTrainingSessionForTrainer, trainerID])

    const deleteTrainingSession = useCallback(async (trainingSessionID) => {
        try{
            const response = await fetch(`${API_URL}/trainingSession/${trainingSessionID}`, {method: "DELETE"});
            if (!response.ok) throw new Error("Failed to delete Training Session");

            // refresh data after deletion
            loadData();
            Alert.alert("Success", "Training Session  deleted successfully")
        } catch (error) {
            console.error("Error, failed to delete Training Session", error)
            Alert.alert("Error", error.message);
        }
    }, [loadData])

    return { trainingSessions, nextTrainingSession, isLoading, loadData, deleteTrainingSession}
}