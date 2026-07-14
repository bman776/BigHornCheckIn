import { useAuth, useSignUp, isClerkAPIResponseError } from '@clerk/expo'
import { type Href, Link, useRouter } from 'expo-router'
import React from 'react'
import { Text, Pressable, StyleSheet, TextInput, View, TouchableOpacity } from 'react-native'
import { styles as authStyles} from "@/assets/styles/auth.styles.js"
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp()
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  // const [firstName, setFirstName] = React.useState('')
  // const [lastName, setLastName] = React.useState('')
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState('')

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password
    })
    if (isClerkAPIResponseError(error)) {
      if (error.errors?.[0].code === "form_identifier_exists") {
        setError("An account with that email address already exists, Please use another")
      } else {
        setError("An Error has occured, please try again")
      }

      // DEBUGGING
      //console.error(JSON.stringify(error, null, 2))
      
      return
    }

    if (!error) await signUp.verifications.sendEmailCode()
  }

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    })
    if (signUp.status === 'complete') {
      await signUp.finalize({
        // Redirect the user to the home page after signing up
        navigate: ({ session, decorateUrl }) => {
          // Handle session tasks
          // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
          if (session?.currentTask) {
            console.log(session?.currentTask)
            return
          }

          // If no session tasks, navigate the signed-in user to the home page
          const url = decorateUrl('/')
          if (url.startsWith('http')) {
            window.location.href = url
          } else {
            router.push(url as Href)
          }
        },
      })
    } else {
      // Check why the sign-up is not complete
      console.error('Sign-up attempt not complete:', signUp)
    }
  }

  if (signUp.status === 'complete' || isSignedIn) {
    return null
  }

  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View style={authStyles.verificationContainer}>
        <Text style={authStyles.verificationTitle}>
          Verify your account
        </Text>

        {error ? (
          <View style={authStyles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={authStyles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[authStyles.verificationInput, error && authStyles.errorInput]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#9A8478"
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        {errors.fields.code && (
          <Text style={styles.error}>{errors.fields.code.message}</Text>
        )}
        <Pressable
          style={({ pressed }) => [
            authStyles.button,
            fetchStatus === 'fetching' && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleVerify}
          disabled={fetchStatus === 'fetching'}
        >
          <Text style={authStyles.buttonText}>Verify</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => signUp.verifications.sendEmailCode()}
        >
          <Text style={styles.secondaryButtonText}>I need a new code</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <KeyboardAwareScrollView 
      style={{flex:1}} 
      contentContainerStyle={{flexGrow:1}} 
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={100}
    >
      <View style={[authStyles.container]}>

        <Image source={require("../../assets/images/BigHornLogo_main.png")} style={authStyles.illustration} />

        <Text style={authStyles.title}>
          Create Account
        </Text>

        {error ? (
          <View style={authStyles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={authStyles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[authStyles.input, error && authStyles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor="#9A8478"
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          keyboardType="email-address"
        />
        {errors.fields.emailAddress && (
          <Text style={styles.error}>{errors.fields.emailAddress.message}</Text>
        )}

        {/* <TextInput
          style={[authStyles.input, error && authStyles.errorInput]}
          value={firstName}
          placeholder="Enter first name"
          placeholderTextColor="#9A8478"
          onChangeText={(firstName) => setFirstName(firstName)}
        />
        {errors.fields.firstName && (
          <Text style={styles.error}>{errors.fields.firstName.message}</Text>
        )}

        <TextInput
          style={[authStyles.input, error && authStyles.errorInput]}
          value={lastName}
          placeholder="Enter last name"
          placeholderTextColor="#9A8478"
          onChangeText={(lastName) => setLastName(lastName)}
        />
        {errors.fields.lastName && (
          <Text style={styles.error}>{errors.fields.lastName.message}</Text>
        )} */}

        <TextInput
          style={[authStyles.input, error && authStyles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
        {errors.fields.password && (
          <Text style={styles.error}>{errors.fields.password.message}</Text>
        )}

        <Pressable
          style={({ pressed }) => [
            authStyles.button,
            (!emailAddress || !password || fetchStatus === 'fetching') && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={!emailAddress || !password || fetchStatus === 'fetching'}
        >
          <Text style={authStyles.buttonText}>Sign up</Text>
        </Pressable>

        {/* For your debugging purposes. You can just console.log errors, but we put them in the UI for convenience */}
        {/*errors && <Text style={styles.debug}>{JSON.stringify(errors, null, 2)}</Text>*/}

        <View style={styles.linkContainer}>
          <Text>Already have an account? </Text>
          <Link href="/sign-in">
            <Text>Sign in</Text>
          </Link>
        </View>

        {/* Required for sign-up flows. Clerk's bot sign-up protection is enabled by default */}
        <View nativeID="clerk-captcha" />
      </View>
    </KeyboardAwareScrollView>
  )
}


// Original Styles code that came with Clerk quick start guide
// -----------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 12
  },
  title: {
    marginBottom: 8,
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryButtonText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  linkContainer: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 12,
    alignItems: 'center',
  },
  error: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: -8,
  },
  debug: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 8,
  },
})