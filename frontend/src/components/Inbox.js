import UserInbox from "./UserInbox";


function Inbox({ key, participants }) {
    return (
        <div>
            {key}
            {participants}
            <UserInbox/>
        </div>
    );
}

export default Inbox;
