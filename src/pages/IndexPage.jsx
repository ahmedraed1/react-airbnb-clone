import { useContext } from "react";
import { UserContext } from "../UserContext";
export default function IndexPage() {
  const { user } = useContext(UserContext);
  return (
    <>
      <h1>Index Page</h1>
      {user && <h1>{user.name}</h1>}
    </>
  );
}
