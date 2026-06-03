import { useClerk } from "@clerk/clerk-expo"
import * as Linking from "expo-linking"
import { Text, TouchableOpacity } from "react-native"

export const SignOutButton = () => {
    const { singOut } = useClerk();
    const handleSignOut = async () => {
        try {
            await singOut();
            Linking.openURL(Linking.createURL("/"))
        } catch (err) {
            console.error(JSON.stringify(err, null, 2))
        }
    };

    return (
        <TouchableOpacity onPress={handleSignOut}>
            <Text>Sign Out</Text>
        </TouchableOpacity>
    )
}