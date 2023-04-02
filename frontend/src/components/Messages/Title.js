import { useMessage } from "../../context/messageContext";

export default function Title() {
    const { selectedGroup } = useMessage();
    // const { groupName, participants } = selectedGroup;
    return (
        <div className="title-container">
            <div className="profile-photo"></div>
            <div className="group-description">
                <div className="group-title">{selectedGroup && selectedGroup.groupName}</div>
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
