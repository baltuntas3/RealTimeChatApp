import { useMessage } from "../../context/messageContext";
import { useUser } from "../../context/userContext";

export default function Title() {
    const { selectedGroup } = useMessage();
    const { user } = useUser();
    // const { groupName, participants } = selectedGroup;

    function getSenderName() {
        return selectedGroup?.participants.filter(({ _id: userId }) => user.id !== userId)[0].userName;
    }

    return (
        <div className="title-container">
            <div className="profile-photo"></div>
            <div className="group-description">
                <div className="group-title">
                    {selectedGroup.participants.length > 2 ? <>{selectedGroup.groupName}</> : getSenderName()}
                </div>
                <div className="group-users">
                    {selectedGroup &&
                        selectedGroup.participants.map(({ userName }, id) => (
                            <span key={id}>
                                {id > 0 && ", "}
                                {userName}
                            </span>
                        ))}
                </div>
            </div>
        </div>
    );
}
