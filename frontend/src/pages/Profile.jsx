import {useAtomValue, useSetAtom} from "jotai";
import {userInformation} from "../lib/GlobalStates";
import {getUserInfo} from "../services/Api";
import {useEffect} from "react";

export default function ProfilePage() {
    const user = useAtomValue(userInformation);
    const setUser = useSetAtom(userInformation);

    async function getUserInformation() {
        const [userUseroglu, err] = await getUserInfo();
        if (err) {
            console.log('❌ Error fetching user info:', err);
            return;
        }
        setUser(userUseroglu);
    }

    useEffect(() => {
        getUserInformation();
    }, []);

    return (
        <div className="container">
            {user && (
                <>
                    Profile
                    {user._id}
                    {user.username}
                </>
            )}
        </div>
    );
}
