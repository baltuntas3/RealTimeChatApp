// Commented out unused imports

import ReactTimeAgo from "react-time-ago";
export default function Groups({groups, handleSelectGroup}) {
    function isMoreThanTwoParticipants(participants) {
        return participants.length > 2;
    }

    return (
        <>
            {groups &&
                groups.map(
                    (
                        {
                            participants,
                            lastMessage: {
                                message: lastMessage,
                                sender: {userName: senderName},
                                createdAt,
                            },
                            groupName,
                            _id: groupId,
                        },
                        id
                    ) => {
                        return (
                            <div
                                className="group-container"
                                tabIndex={id + 1}
                                key={id}
                                onClick={() => {
                                    // setDeneme(groups[id]);
                                    handleSelectGroup(groups[id]);
                                }}>
                                <div>
                                    <div
                                        className={`profile-photo ${
                                            isMoreThanTwoParticipants(participants) ? "profile-photo-group" : ""
                                        } group-profile-photo`}></div>
                                </div>
                                <div className="group-message-section">
                                    <div>
                                        {isMoreThanTwoParticipants(participants) ? groupName : senderName}
                                        <div className="group-last-message">
                                            <ReactTimeAgo
                                                date={Date.now() - (Date.now() - new Date(createdAt).getTime())}
                                                locale="tr"
                                            />
                                        </div>
                                    </div>
                                    <div className="group-last-message truncate-long-texts">
                                        {isMoreThanTwoParticipants(participants) && senderName} {lastMessage}
                                        <span className="group-check"></span>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                )}
        </>
    );
}
