import { Show, useUser } from '@clerk/expo'
import { useClerk } from '@clerk/expo'
import { Link, router, useRouter } from 'expo-router'
import { Text, View, Pressable, StyleSheet, TouchableOpacity } from 'react-native'
import { useEffect } from 'react';
import { useTrainingSessions } from "../../hooks/useTrainingSessions";
import PageLoader from "../../components/PageLoader.jsx";
import { SignOutButton } from "../../components/SignOutButton.jsx"
import { TrainingSessionSummary } from "../../components/TrainingSessionSummary.jsx";
import { styles } from "../../assets/styles/home.styles";
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';



export default function Page() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter();
  const { trainingSessions, nextTrainingSession, isLoading, loadData, deleteTrainingSession } = useTrainingSessions(user?.id)

  useEffect(() => {
    loadData();
  }, [loadData])

  if (isLoading) return <PageLoader />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>

          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/BigHornLogo_main.png")}
              style={styles.headerLogo}
              resizeMode='contain'
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>

          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/schedule")}>
              <Ionicons name="add" size={20} color="#FFF"/>
              <Text style={styles.addButtonText}>Schedule</Text>
            </TouchableOpacity>
            <SignOutButton/>
          </View>
        </View>

        <TrainingSessionSummary summary={nextTrainingSession}></TrainingSessionSummary>

      </View>

    </View>

    // OLD VIEW
    // <View style={styles.container}>
    //   <Text style={styles.title}>Welcome!</Text>
    //   <Text>User ID: {user?.id}</Text>
    //   <Text>Next Training Session: {nextTrainingSession.title}</Text>
    //   <Show when="signed-out">
    //     <Link href="/(auth)/sign-in">
    //       <Text>Sign in</Text>
    //     </Link>
    //     <Link href="/(auth)/sign-up">
    //       <Text>Sign up</Text>
    //     </Link>
    //   </Show>
    //   <Show when="signed-in">
    //     <Text>Hello {user?.id}</Text>
    //     <Pressable style={styles.button} onPress={() => signOut()}>
    //       <Text style={styles.buttonText}>Sign out</Text>
    //     </Pressable>
    //   </Show>
    // </View>
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     paddingTop: 60,
//     gap: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//   },
//   button: {
//     backgroundColor: '#0a7ea4',
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
// })