// react custom hook for Training Sessions

import { useState, useCallback } from "react"
import { Alert } from "react-native"
import { API_URL } from "../constants/api"
import { CLIENT_ERROR_RESPONSE } from "../constants/responseCodes"

//const API_URL = "https://bighorncheckin-api.onrender.com/api" 

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
            const response = await fetch(`${API_URL}/trainingSession/allTrainingSessionsForTrainer/${trainerID}`);
            if (response.ok) {
                // DEBUGGING
                console.log(`Returned response for getAllTrainingSessionsForTrainer: ${JSON.stringify(response)}`);
                
                // parse response body
                const respBody = await response.json();
                
                // DEBUGGING
                console.log(`Returned data for getAllTrainingSessionsForTrainer: ${JSON.stringify(respBody)}`);

                setTrainingSessions(respBody);
            
            } else if (response.status === CLIENT_ERROR_RESPONSE.NOT_FOUND) {
                setTrainingSessions([]);
            
            }  else {
                // DEBUGGING
                console.log(`type of response code: ${typeof response.status}`)

                throw new Error(`HTTP Error! Status: ${response.status}`);
            }
        
        } catch (error) {
            console.error("Error, failed to get Training Sessions", error)
        }
    }, [trainerID]) 

    const getNextTrainingSessionForTrainer = useCallback(async () => {
        try{
            const response = await fetch(`${API_URL}/trainingSession/nextTrainingSessionForTrainer/${trainerID}`);
            if (response.ok) {
                // DEBUGGING
                console.log(`Returned response for getNextTrainingSessionForTrainer: ${JSON.stringify(response)}`);

                const respBody = await response.json();
                
                // DEBUGGING
                console.log(`Returned data for getNextTrainingSessionForTrainer: ${JSON.stringify(respBody)}`);

                setNextTrainingSession(respBody.data)
            
            } else if (response.status === CLIENT_ERROR_RESPONSE.NOT_FOUND) {
                setNextTrainingSession({
                    title: "<Training Session Title>",
                    startTime: "<Start Time>",
                    endTime: "<End Time>",
                    checkedIn: [],
                    awaiting: []
                });
            
            } else {
                // DEBUGGING 
                console.log(`type of response code: ${typeof response.status}`);
                console.log(`response code value: ${response.status}`)
                console.log(`type of constant: ${typeof CLIENT_ERROR_RESPONSE.NOT_FOUND}`)
                console.log(`constant value: ${CLIENT_ERROR_RESPONSE.NOT_FOUND}`)
                console.log(`condition evaluation: ${response === CLIENT_ERROR_RESPONSE.NOT_FOUND}`);

                throw new Error(`HTTP Error! Status ${response.status}`);
            }
        
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