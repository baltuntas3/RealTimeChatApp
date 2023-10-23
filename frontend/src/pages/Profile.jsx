import {useAtomValue} from "jotai";
import {userInformation} from "../lib/GlobalStates";

export default function ProfilePage() {
    const user = useAtomValue(userInformation);

    return (
        <div>
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
