import React from "react";
import { useUser } from "../context/userContext";
export default function Home() {
    const { user } = useUser();
    return <div>Home</div>;
}
