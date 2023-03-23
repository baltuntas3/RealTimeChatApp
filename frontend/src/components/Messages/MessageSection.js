import { useUser } from "../../context/userContext";

export default function MessageSection({ messages }) {
    const { user } = useUser();

    return (
        <div className="message-section">
            {/* iterate this two element  */}
            {messages.map((val, id) => {
                const { sender, message } = val;
                return sender == user.id ? (
                    <div key={id} className="message sender">
                        {message}
                    </div>
                ) : (
                    <div key={id} className="message receiver">
                        {message}
                    </div>
                );
            })}
        </div>
    );
}
