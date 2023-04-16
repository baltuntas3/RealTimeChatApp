import { useUser } from "../context/userContext";

export default function ProfilePage() {
    const { user } = useUser();
    console.log(user);
    return (
        <div>
            Profile
            {user.id}
        </div>
    );
}
