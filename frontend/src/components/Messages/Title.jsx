import {userInformation} from "../../lib/GlobalStates";
import {useAtomValue} from "jotai";

export default function Title({selectedGroup}) {
    const user = useAtomValue(userInformation);
    // const { groupName, participants } = selectedGroup;

    function getSenderName() {
        return selectedGroup?.participants.filter(({_id: userId}) => user.id !== userId)[0].userName;
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
                        selectedGroup.participants.map(({userName}, id) => (
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
