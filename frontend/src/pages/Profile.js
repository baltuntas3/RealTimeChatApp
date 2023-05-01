import { useUser } from "../context/userContext";

export default function ProfilePage() {
    const { user } = useUser();

    return (
        <div>
            Profile
            {user.id}
            {user.username}
        </div>
    );
}
