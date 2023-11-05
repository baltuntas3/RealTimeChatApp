// import {useEffect, useState} from "react";
// import {getLastMessageInGroup} from "../../services/api";
// import {userInformation, websocketConnection, lastMessage} from "../../lib/GlobalStates";
// import {useAtomValue, useAtom} from "jotai";

import ReactTimeAgo from "react-time-ago";
export default function Groups({groups, handleSelectGroup}) {
    function isMoreThanTwoParticipants(participants) {
        return participants.length > 2;
    }

    console.log(groups);

    return (
        <div className="group-container">
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
                                className="group-description"
                                key={id}
                                tabIndex={id + 1}
                                onClick={() => {
                                    // setDeneme(groups[id]);
                                    handleSelectGroup(groups[id]);
                                }}>
                                <div
                                    className={`profile-photo ${
                                        isMoreThanTwoParticipants(participants) && "profile-photo-group"
                                    }`}></div>
                                <div className="group-title">
                                    {isMoreThanTwoParticipants(participants) ? groupName : senderName}
                                    <div className="group-last-message group-date">
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
                        );
                    }
                )}
        </div>
    );
}
